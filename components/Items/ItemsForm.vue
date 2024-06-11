<template>
<div class="flex flex-col">
  <Head title="Register" />
  <h1 class="title text-center"><i><u>Lost</u></i> or<br /><i><u>Found</u></i> something?<br /> just <i><u>Report</u></i> it!</h1>
  <div class="w-full mx-auto bg-slate-100 p-3 rounded-lg">
    <form @submit.prevent="submitForm">
      <div class="grid place-items-center">
        <div class="relative w-28 h-28 rounded-full overflow-hidden border border-slate-300">
          <label for="item_pic" class="absolute inset-0 grid content-end cursor-pointer">
            <span class="bg-white/70 pb-2 text-center">Item Pic</span>
          </label>
          <input type="file" @change="changePic" id="item_pic" hidden>
          <img class="object-cover w-28 h-28" :src="form.preview ?? '/storage/avatars/default.jpg'" />
        </div>
        <p class="error mt-2">{{ form.errors?.item_pic }}</p>
      </div>
      <TextInput name="Name" v-model="form.item_name" :message="form.errors?.item_name" />
      <TextInput name="Description" v-model="form.item_description" :message="form.errors?.item_description" />
      <!-- Status dropdown -->
      <div class="mb-6">
        <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
        <select id="status" v-model="form.item_status" class="w-[270px] flex mt-1 block py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
          <option v-for="status in statuses" :key="status">{{ status }}</option>
        </select>
        <p class="error mt-2">{{ form.errors?.item_status }}</p>
      </div>
      <!-- Type dropdown -->
      <div class="mb-6">
        <label for="type" class="block text-sm font-medium text-gray-700">Type</label>
        <select id="type" v-model="form.item_type" class="w-[270px] flex mt-1 block py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
          <option v-for="type in typesMap[form.item_status] ?? []" :key="type">{{ type }}</option>
        </select>
        <p class="error mt-2">{{ form.errors?.item_type }}</p>
      </div>
      <TextInput name="Date" type="date" class="w-100" v-model="form.reported_on" :message="form.errors?.reported_on" />
      <TextInput name="Time" type="time" v-model="form.reported_at" :message="form.errors?.reported_at" />
      <div id="layout">
        <Map :height="350" :width="362" @update:coordinates="updateCoordinates" class="mt-4" />
      </div>
      <input type="hidden" v-model="form.latitude" />
      <input type="hidden" v-model="form.longitude" />
      
      <div v-if="errorMessage.length > 0">
        {{ errorMessage }}
      </div>
      <div>
        <button class="bg-green-500 text-white font-bold primary-btn mt-12 w-full p-4 rounded mb-4" :disabled="form.processing">Report it now</button>
      </div>
    </form>
  </div>
</div>
</template>

<script setup lang="ts">
const router = useRouter();
const user = useSupabaseUser();
const supabase = useSupabaseClient();
const errorMessage = ref("");
// Define the form and its initial values
const form = reactive({
  item_name: '',
  item_description: '',
  item_status: '',
  item_type: '',
  latitude: null,
  longitude: null,
  reported_on: '',
  reported_at: '',
  item_pic: null,
  preview: '',
  errors: {
    item_name: '',
    item_description: '',
    item_status: '',
    item_type: '',
    latitude: '',
    longitude: '',
    reported_on: '',
    reported_at: '',
    item_pic: ''
  },
  processing: false
});
const statuses = ['Lost', 'Found', 'Report'];
const typesMap = {
  Lost: ['Electronics', 'Clothing', 'Jewelry', 'Other'],
  Found: ['Electronics', 'Clothing', 'Jewelry', 'Other'],
  Report: ['Incident', 'Complaint', 'Suggestion', 'Pothole', 'Sinkhole', 'Trip Hazard', 'Crime', 'Theft', 'Disturbance', 'Danger', 'Crash', 'Dog Poop', 'UFO']
};
// Define the changePic method to handle file input change
const changePic = (e: Event) => {
  const input = e.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    form.item_pic = input.files[0];
    form.preview = URL.createObjectURL(input.files[0]);
  }
};
// Format date
const formatDate = (date: any) => {
  const d = new Date(date);
  if (isNaN(d.getTime())) {
    // If the date is invalid, return an empty string or handle the error accordingly
    console.error('Invalid date:', date);
    return '';
  }

  let month = '' + (d.getMonth() + 1);
  let day = '' + d.getDate();
  const year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
};
// Define the submit method to handle form submission
const submitForm = async () => {
  const fileName = Math.floor(Math.random() * 10000000000000000);
  const {data, error} = await supabase.storage.from("images").upload("public/items/" + fileName, form.item_pic)

  if (error) {
    return errorMessage.value = "Cannot upload image";
  }

  form.processing = true;

  console.log("Form: ", form);
  console.log("User: ", user.value);

  if (!user.value) {
    console.error('User is not loaded');
    errorMessage.value = 'You must be logged in to create an item';
    form.processing = false;
    return;
  }

  if (!user.value.id) {
    console.error('User ID is not available');
    errorMessage.value = 'User ID is not available';
    form.processing = false;
    return;
  }
  
  const formattedDate = formatDate(form.reported_on);
  if (!formattedDate) {
    errorMessage.value = 'Invalid reported date';
    form.processing = false;
    return;
  }

  const body = {
    item_name: form.item_name,
    item_description: form.item_description,
    item_status: form.item_status,
    item_type: form.item_type,
    latitude: parseFloat(form.latitude),
    longitude: parseFloat(form.longitude),
    reported_on: formattedDate,
    reported_at: form.reported_at,
    item_pic: data.path,
    user_id: user.value.id
  };

  try {
    console.log("X body: ", body)
    await addItem(body);
    router.push('/items');
  } catch (error) {
    console.error('Error creating item:', error);
    await supabase.storage.from("images").remove([data.path]);
    alert('There was an error creating the item');
  } finally {
    form.processing = false;
  }
};

// Calculate the max date string (YYYY-MM-DD) for the max attribute
const maxDate = computed(() => {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
  const day = today.getDate().toString().padStart(2, '0');
  return `${day}/${month}/${year}`;
});

// ADD ITEM
const addItem = async (item: any) => {
  if (item) {
    return await $fetch('/api/items', {
      method: "POST",
      body: item
    });
  }
};

// Update the form's latitude and longitude when the map coordinates change
const updateCoordinates = ({ lng, lat }: { lng: number, lat: number }) => {
  form.latitude = lat;
  form.longitude = lng;
};
</script>


<style scoped>
#layout {
  flex: 1;
  display: block;
  position: relative;
  width: 250px;
  height: 350px;
  margin-bottom: 20px;
}
</style>
