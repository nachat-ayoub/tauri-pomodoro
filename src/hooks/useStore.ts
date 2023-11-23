import { defaultSettings, initSettings } from '../utils/settings';
import { devtools } from 'zustand/middleware';
import { create } from 'zustand';

export interface Profile {
  profileName: string;
  workTime: number;
  breakTime: number;
  longBreakTime: number;
  workSessions: number;
  alarmFilePath: string;
  active: boolean;
}

export interface IStoreState {
  profiles: Profile[];
  selectedProfile: Profile;
  doneSessions: number;
  setProfiles: (profiles: Profile[]) => void;
  addProfile: (newProfile: Profile) => void;
  updateProfile: (updatedProfile: Profile) => void;
  removeProfile: (profileName: string) => void;
  selectProfile: (profileName: string) => void;
  saveData: (state: IStoreState) => void;
  initDoneSessions: () => void;
  incrementDoneSessions: () => void;
}

const useStore = create<IStoreState>()(
  devtools((set) => ({
    selectedProfile: defaultSettings[0],
    profiles: defaultSettings,
    doneSessions: 0,
    initDoneSessions: () => {
      set(() => ({ doneSessions: 0 }));
    },
    incrementDoneSessions: () => {
      set((state) => ({ doneSessions: state.doneSessions + 1 }));
    },

    setProfiles: (profiles: Profile[]) => {
      set(() => ({ profiles }), false, 'setProfiles');
    },

    addProfile: (newProfile: Profile) => {
      set(
        (state) => ({
          profiles: [...state.profiles, newProfile],
        }),
        false,
        'addProfile'
      );
    },

    updateProfile: (updatedProfile: Profile) => {
      set(
        (state) => ({
          profiles: state.profiles.map((profile) => {
            if (profile.profileName === updatedProfile.profileName) {
              return updatedProfile;
            }
            return profile;
          }),
        }),
        false,
        'updateProfile'
      );
    },

    removeProfile: (profileName: string) => {
      set(
        (state) => {
          const indexToRemove = state.profiles.findIndex(
            (profile) => profile.profileName === profileName
          );
          if (indexToRemove !== -1) {
            const isProfileSelected =
              state.selectedProfile &&
              state.selectedProfile.profileName === profileName;
            return {
              profiles: state.profiles.filter(
                (_profile, index) => index !== indexToRemove
              ),
              selectedProfile: isProfileSelected
                ? state.profiles[0]
                : state.selectedProfile,
            };
          }
          return state;
        },
        false,
        'removeProfile'
      );
    },

    selectProfile: (profileName: string) => {
      set(
        (state) => {
          const selectedProfile = state.profiles.find(
            (profile) => profile.profileName === profileName
          );
          if (selectedProfile) {
            return {
              selectedProfile,
              profiles: state.profiles.map((profile) => {
                return profile === selectedProfile
                  ? { ...profile, active: true }
                  : { ...profile, active: false };
              }),
            };
          }
          return state;
        },
        false,
        'selectProfile'
      );
    },

    saveData: async (state: IStoreState) => {
      try {
        console.log('Store State Updated:', state);
        await initSettings(state.profiles);
      } catch (error) {
        console.error('Error saving profile data:', error);
      }
    },
  }))
);

// Subscribe to state changes and trigger saveData
// useStore.subscribe((state) => {
//   useStore().saveData(state);
// });

export default useStore;
