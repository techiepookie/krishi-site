import axios from 'axios';

const API_URL = 'http://localhost:5000/api/google-fit';

const GOOGLE_FIT_CLIENT_ID = process.env.REACT_APP_GOOGLE_FIT_CLIENT_ID;
const SCOPES = [
  'https://www.googleapis.com/auth/fitness.activity.read',
  'https://www.googleapis.com/auth/fitness.heart_rate.read',
  'https://www.googleapis.com/auth/fitness.sleep.read',
];

class GoogleFitService {
  constructor() {
    this.isInitialized = false;
  }

  async initialize() {
    if (this.isInitialized) return;

    await new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => {
        window.gapi.load('client:auth2', () => {
          window.gapi.client.init({
            clientId: GOOGLE_FIT_CLIENT_ID,
            scope: SCOPES.join(' ')
          }).then(() => {
            this.isInitialized = true;
            resolve();
          });
        });
      };
      document.body.appendChild(script);
    });
  }

  async signIn() {
    await this.initialize();
    const auth = window.gapi.auth2.getAuthInstance();
    await auth.signIn();
    return auth.isSignedIn.get();
  }

  async getFitnessData() {
    const auth = window.gapi.auth2.getAuthInstance();
    if (!auth.isSignedIn.get()) {
      throw new Error('User not signed in');
    }

    const endTime = new Date();
    const startTime = new Date();
    startTime.setDate(startTime.getDate() - 1); // Get last 24 hours data

    const fitness = await window.gapi.client.request({
      path: 'https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate',
      method: 'POST',
      body: {
        aggregateBy: [
          {
            dataTypeName: 'com.google.step_count.delta',
          },
          {
            dataTypeName: 'com.google.heart_rate.bpm',
          },
          {
            dataTypeName: 'com.google.sleep.segment',
          },
          {
            dataTypeName: 'com.google.active_minutes',
          },
        ],
        bucketByTime: { durationMillis: 86400000 }, // 24 hours
        startTimeMillis: startTime.getTime(),
        endTimeMillis: endTime.getTime(),
      },
    });

    const data = {
      steps: 0,
      heartRate: 0,
      sleepHours: 0,
      activeMinutes: 0,
    };

    // Process the response
    const buckets = fitness.result.bucket;
    buckets.forEach(bucket => {
      bucket.dataset.forEach(dataset => {
        const points = dataset.point || [];
        points.forEach(point => {
          switch (dataset.dataSourceId) {
            case 'derived:com.google.step_count.delta:com.google.android.gms:estimated_steps':
              data.steps += point.value[0].intVal;
              break;
            case 'derived:com.google.heart_rate.bpm:com.google.android.gms:merge_heart_rate_bpm':
              data.heartRate = Math.round(point.value[0].fpVal);
              break;
            case 'derived:com.google.sleep.segment:com.google.android.gms:merged':
              if (point.value[0].intVal === 1) { // 1 represents sleep
                const durationMs = point.endTimeNanos/1000000 - point.startTimeNanos/1000000;
                data.sleepHours += durationMs / (1000 * 60 * 60);
              }
              break;
            case 'derived:com.google.active_minutes:com.google.android.gms:merge_active_minutes':
              data.activeMinutes += point.value[0].intVal;
              break;
          }
        });
      });
    });

    data.sleepHours = Math.round(data.sleepHours * 10) / 10; // Round to 1 decimal place
    return data;
  }
}

export const googleFitService = {
  getAuthUrl: async () => {
    const response = await axios.get(`${API_URL}/auth-url`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data.auth_url;
  },

  handleCallback: async (code) => {
    const response = await axios.post(
      `${API_URL}/callback`,
      { code },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
    return response.data;
  },

  syncData: async () => {
    const response = await axios.post(
      `${API_URL}/sync`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
    return response.data;
  },

  getFitnessData: async () => {
    const response = await axios.get(`${API_URL}/fitness-data`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  }
};

export default new GoogleFitService();
