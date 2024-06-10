<template>
  <div>
    <div id="sidebar">Longitude: {{ location.lng }} | Latitude: {{ location.lat }} | Zoom: {{ location.zoom }}</div>
    <div ref="mapContainer" :style="{ height: `${props.height}px`, width: '100%' }" class="map-container">
      <!-- Add crosshair element -->
      <div class="crosshair"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import mapboxgl from "mapbox-gl";
import { ref, reactive, onMounted, onUnmounted, watch } from 'vue';

const props = defineProps({
  height: Number,
  width: Number,
  data: {
    type: Array,
    default: () => []
  },
  filter: {
    type: String,
    default: ''
  }
});

mapboxgl.accessToken = 'pk.eyJ1IjoiamJpZGR1bHBoIiwiYSI6ImNscDgzemt0ZzJjNW8ydnM0MXJvNG56NjEifQ.h0CNNEv-Yjgkp4WMjOK9mA';

const map = ref<mapboxgl.Map | null>(null);
const mapContainer = ref<HTMLDivElement | null>(null);
const location = reactive({
  lng: -0.392432,
  lat: 50.819092,
  zoom: 16
});

const emit = defineEmits(['update:coordinates']);
let markers = [];

const getUserLocation = () => {
  return new Promise<{ longitude: number; latitude: number }>((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          resolve({
            longitude: position.coords.longitude,
            latitude: position.coords.latitude
          });
        },
        error => {
          reject(error);
        }
      );
    } else {
      reject(new Error('Geolocation is not supported by this browser.'));
    }
  });
};

const createMarkerElement = (color: string) => {
  const markerElement = document.createElement('div');
  markerElement.style.width = '30px';
  markerElement.style.height = '30px';
  markerElement.style.backgroundColor = color;
  markerElement.style.borderRadius = '50%';
  markerElement.style.border = '2px solid white';
  return markerElement;
};

const addMarkers = () => {
  if (map.value) {
    markers.forEach(marker => marker.remove());
    markers = [];

    props.data.forEach(item => {
      if (props.filter && item.item_status !== props.filter) return;

      let markerColor = '#2fc5e0';
      if (item.item_status === 'Lost') {
        markerColor = '#ff0066';
      } else if (item.item_status === 'Found') {
        markerColor = 'green';
      }

      const markerElement = createMarkerElement(markerColor);
      const marker = new mapboxgl.Marker({ element: markerElement })
        .setLngLat([item.longitude, item.latitude])
        .addTo(map.value);

      const imageUrl = item.item_pic ? `storage/${item.item_pic}` : 'storage/avatars/default.jpg';
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div class="w-auto h-32 flex flex-row p-0 m-0">
          <div>
            <img src="${imageUrl}" alt="Avatar" class="m-0 pr-2 h-32">
          </div>
          <div>
            <h3 class="text-2xl p-0 m-0">${item.item_name || 'No Title'}</h3>
            <p>${item.item_description || 'No Description'}</p>
          </div>
        </div>
      `);

      marker.setPopup(popup);
      markers.push(marker);
    });
  }
};

onMounted(async () => {
  try {
    if (mapContainer.value) {
      map.value = new mapboxgl.Map({
        container: mapContainer.value,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [location.lng, location.lat],
        zoom: location.zoom
      });

      map.value.on('move', () => {
        const { lng, lat } = map.value.getCenter();
        const zoom = map.value.getZoom();
        location.lng = lng.toFixed(6);
        location.lat = lat.toFixed(6);
        location.zoom = zoom.toFixed(2);

        emit('update:coordinates', {
          lng: location.lng,
          lat: location.lat,
        });
      });

      const crosshair = document.createElement('div');
      crosshair.className = 'crosshair';
      mapContainer.value.appendChild(crosshair);

      try {
        const userLocation = await getUserLocation();
        location.lng = userLocation.longitude;
        location.lat = userLocation.latitude;
        map.value.setCenter([location.lng, location.lat]);
      } catch (error) {
        console.error('Error getting user location:', error);
        alert('Geolocation permission denied. Using default location.');
        map.value.setCenter([location.lng, location.lat]);
      }

      addMarkers();
    }
  } catch (error) {
    console.error('Error initializing map:', error);
  }
});

watch(() => props.filter, addMarkers);

onUnmounted(() => {
  if (map.value) {
    map.value.remove();
    map.value = null;
  }
});
</script>

<style scoped>
.map-container {
  display: block;
  flex: 1;
  position: relative;
}
.mapboxgl-popup-content {
  width: 514px;
  display: flex;
}
#sidebar {
  background-color: rgb(35 55 75 / 90%);
  color: #fff;
  padding: 6px 12px;
  font-family: monospace;
  font-size: 0.6rem;
  z-index: 1;
  position: absolute;
  top: 10;
  left: 0;
  margin: 12px;
  border-radius: 4px;
}
.crosshair {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  border: 2px solid #c80000;
  border-radius: 50%;
  pointer-events: none;
  z-index: 1;
}
</style>
