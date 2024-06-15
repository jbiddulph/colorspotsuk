<template>
  <div class="flex flex-col">
    <Head title="Register" />
    <h1 class="my-4 text-center text-2xl"><i><u><b>Lost</b></u></i> or<br /><i><u><b>Found</b></u></i> something?<br /> just <i><u><b>Report</b></u></i> it!</h1>
    <div>{{ props.isEditMode }}</div>
    <div class="w-full mx-auto bg-white border mb-12 p-3 rounded-lg">
      <form @submit.prevent="submitForm">
        <div class="grid place-items-center">
          <div class="relative w-28 h-28 rounded-full overflow-hidden border border-slate-300">
            <label for="item_pic" class="absolute inset-0 grid content-end cursor-pointer">
              <span class="bg-white/70 pb-2 text-center">Item Pic</span>
            </label>
            <input type="file" @change="changePic" id="item_pic" hidden>
            <img class="object-cover w-28 h-28" :src="form.preview ?? defaultImageUrl" />
          </div>
          <small class="text-red-700 mt-2">{{ form.errors.item_pic }}</small>
        </div>
        <TextInput name="Title" v-model="form.item_name" :message="form.errors.item_name" />
        <TextInput name="Description" v-model="form.item_description" :message="form.errors.item_description" />
        <!-- Status dropdown -->
        <div class="mb-6">
          <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
          <select id="status" v-model="form.item_status" class="w-[270px] flex mt-1 block py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            <option v-for="status in statuses" :key="status">{{ status }}</option>
          </select>
          <small class="text-red-700 mt-2">{{ form.errors.item_status }}</small>
        </div>
        <!-- Type dropdown -->
        <div class="mb-6">
          <label for="type" class="block text-sm font-medium text-gray-700">Type</label>
          <select id="type" v-model="form.item_type" class="w-[270px] flex mt-1 block py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            <option v-for="type in typesMap[form.item_status] ?? []" :key="type">{{ type }}</option>
          </select>
          <small class="text-red-700 mt-2">{{ form.errors.item_type }}</small>
        </div>
        <div class="flex flex-row">
          <TextInput name="Date" type="date" class="w-50 mr-2" v-model="form.reported_on" :message="form.errors.reported_on" />
          <TextInput name="Time" type="time" v-model="form.reported_at" :message="form.errors.reported_at" />
        </div>
        <div id="layout">
          <Map :height="350" :width="285" @update:coordinates="updateCoordinates" class="mt-4" />
        </div>
        <div class="flex w-100 justify-center mx-auto">
          <div class="bg-green-500 text-white font-bold primary-btn mt-32 w-50 p-2 rounded mb-4 text-sm" @click="getCurrentLocation">Get current location</div>
        </div>
        <input type="hidden" v-model="form.latitude" />
        <input type="hidden" v-model="form.longitude" />

        <div v-if="errorMessage.length > 0">
          {{ errorMessage }}
        </div>
        <div>
          <button v-if="props.isEditMode" class="bg-orange-500 text-white font-bold primary-btn w-full p-4 rounded mb-4" :disabled="form.processing">Update Item</button>
          <button v-else class="bg-green-500 text-white font-bold primary-btn w-full p-4 rounded mb-4" :disabled="form.processing">Report it now</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLocationStore } from "../../stores/location";
const locationStore = useLocationStore();
const appStore = useAppStore();
const router = useRouter();
const route = useRoute();
const user = useSupabaseUser();
const supabase = useSupabaseClient();
const errorMessage = ref("");
const { hasLoaded } = storeToRefs(appStore)
const config = useRuntimeConfig();
const props = defineProps({
  isEditMode: {
    type: Boolean,
    default: false
  }
})
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
  item_pic: null as string | null, // Make item_pic nullable
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
const item = ref(null);
const itemId = route.query.id;
const userId = route.query.user_id;
console.log("itemId: ", itemId);
console.log("userId: ", userId);
console.log("user_id: ", user?.value?.id)

const statuses = ['Lost', 'Found', 'Report'];
const typesMap = {
  Lost: ['Electronics', 'Clothing', 'Jewelry', 'Other'],
  Found: ['Electronics', 'Clothing', 'Jewelry', 'Other'],
  Report: ['Incident', 'Complaint', 'Suggestion', 'Pothole', 'Sinkhole', 'Trip Hazard', 'Crime', 'Theft', 'Disturbance', 'Danger', 'Crash', 'Dog Poop', 'UFO']
};
const defaultImageUrl = `${config.public.supabase.url}/storage/v1/object/public/images/public/items/default.jpg`;
const fetchItem = async () => {
  if (!itemId) return;

  try {
    item.value = await $fetch(`/api/items/${itemId}`);
    if (item.value) {
      form.item_name = item.value.item_name;
      form.item_description = item.value.item_description;
      form.item_status = item.value.item_status;
      form.item_type = item.value.item_type;
      form.latitude = item.value.latitude;
      form.longitude = item.value.longitude;
      form.reported_on = item.value.reported_on;
      form.reported_at = item.value.reported_at;

      if (item.value.item_pic) {
        form.item_pic = `${config.public.supabase.url}/storage/v1/object/public/images/${item.value.item_pic}`; 
        form.preview = `${config.public.supabase.url}/storage/v1/object/public/images/${item.value.item_pic}`;
      } else {
        form.preview = defaultImageUrl;
      }
      const latitude = item.value.latitude;
      const longitude = item.value.longitude;
      locationStore.setLocation(latitude, longitude);
    }
  } catch (error) {
    console.error('Error fetching item:', error);
  }
};


// Watch for changes to itemId to re-fetch item data
watch(() => route.params.id, fetchItem, { immediate: true });
onMounted(() => {
  // if(userId !== user?.value?.id) {
  //   router.push('/auth/profile');
  // }
})
// Define the changePic method to handle file input change
const changePic = (e: Event) => {
  const input = e.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    form.item_pic = input.files[0];
    form.preview = URL.createObjectURL(input.files[0]);
  } else if (props.isEditMode && item.value?.item_pic) {
    // Ensure preview remains linked to the original image path if no new file is selected in edit mode
    form.preview = `${config.public.supabase.url}/storage/v1/object/public/images/${item.value.item_pic}`;
  } else {
    form.preview = defaultImageUrl;
  }
};

// const defaultImageUrl = `${config.public.supabase.url}/storage/v1/object/public/images/public/items/default.jpg`;

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
// Add validation functions to your script setup
const validateField = (field: string, value: any) => {
  switch (field) {
    case 'item_name':
      if (!value) return 'Item name is required';
      break;
    case 'item_description':
      if (!value) return 'Item description is required';
      break;
    case 'item_status':
      if (!value) return 'Item status is required';
      break;
    case 'item_type':
      if (!value) return 'Item type is required';
      break;
    case 'reported_on':
      if (!value) return 'Reported date is required';
      break;
    case 'reported_at':
      if (!value) return 'Reported time is required';
      break;
    case 'latitude':
    case 'longitude':
      if (!value) return 'Coordinates are required';
      break;
    case 'item_pic':
      if (!form.item_pic) return 'Item picture is required';
      break;
    default:
      break;
  }
  return '';
};

const validateForm = () => {
  form.errors.item_name = validateField('item_name', form.item_name);
  form.errors.item_description = validateField('item_description', form.item_description);
  form.errors.item_status = validateField('item_status', form.item_status);
  form.errors.item_type = validateField('item_type', form.item_type);
  form.errors.reported_on = validateField('reported_on', form.reported_on);
  form.errors.reported_at = validateField('reported_at', form.reported_at);
  form.errors.latitude = validateField('latitude', form.latitude);
  form.errors.longitude = validateField('longitude', form.longitude);
  form.errors.item_pic = validateField('item_pic', form.item_pic);

  // Check if there are any errors
  for (let key in form.errors) {
    if (form.errors[key]) return false;
  }
  return true;
};

const getCurrentLocation = () => {

  if (navigator.geolocation) {
    hasLoaded.value = true;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
        locationStore.setLocation(latitude, longitude);
      },
      (error) => {
        console.error("Error getting location: ", error);
      }
    );
    hasLoaded.value = false;
  } else {
    console.error("Geolocation is not supported by this browser.");
  }
}

// Define the submit method to handle form submission
// Update the submitForm method
const submitForm = async () => {
  // Reset error message
  errorMessage.value = '';

  // Validate form
  if (!validateForm()) {
    errorMessage.value = 'Please fix the errors in the form';
    return;
  }
  hasLoaded.value = true;

  form.processing = true;

  let imagePath = item.value?.item_pic ?? 'public/items/default.jpg';

  if (form.item_pic && form.item_pic instanceof File) {
    const fileName = Math.floor(Math.random() * 10000000000000000);
    const { data, error } = await supabase.storage
      .from("images")
      .upload("public/items/" + fileName, form.item_pic);

    if (error) {
      errorMessage.value = "Cannot upload image";
      form.processing = false;
      return;
    }
    imagePath = data.path;
  }

  if (!user.value) {
    errorMessage.value = 'You must be logged in to create an item';
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
    item_pic: imagePath,
    user_id: user.value.id
  };

  const updatedItem = {
    id: itemId,
    item_name: form.item_name,
    item_description: form.item_description,
    item_status: form.item_status,
    item_type: form.item_type,
    latitude: parseFloat(form.latitude),
    longitude: parseFloat(form.longitude),
    reported_on: formattedDate,
    reported_at: form.reported_at,
    item_pic: imagePath,
    user_id: user.value.id
  };
  try {
    if (props.isEditMode) {
      await updateItem({ ...body, id: itemId });
    } else {
      await addItem(body);
    }
    hasLoaded.value = false;
    router.push('/auth/profile');
  } catch (error) {
    if (form.item_pic && form.item_pic instanceof File && imagePath !== 'public/items/default.jpg') {
      await supabase.storage.from("images").remove([imagePath]);
    }
    errorMessage.value = 'There was an error creating/updating the item';
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

// UPDATE ITEM
const updateItem = async (updatedItem: any) => {
  try {
    const response = await $fetch(`/api/items`, {
      method: "PUT",
      body: updatedItem
    });

    // Optionally, handle response here if needed
    console.log("Item updated successfully:", response);

  } catch (error) {
    console.error('Error updating item:', error);
    throw new Error('Failed to update item');
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
  width: 280px;
  height: 285px;
  margin-bottom: 20px;
}
</style>
