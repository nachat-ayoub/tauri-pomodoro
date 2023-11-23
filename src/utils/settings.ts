import { appDataDir } from '@tauri-apps/api/path';
import {
  exists,
  createDir,
  BaseDirectory,
  writeFile,
  readTextFile,
} from '@tauri-apps/api/fs';
import { Profile } from '../hooks/useStore';

//
//

interface Settings {
  find: (selector: Partial<Profile>) => Promise<Profile[]>;
  findOne: (data: Profile[], selector: Partial<Profile>) => Profile | undefined;
  update: (
    selector: Partial<Profile>,
    updatedProperties: Partial<Profile>
  ) => Promise<Profile[]>;
  remove: (selector: Partial<Profile>) => Promise<Profile[]>;
}

const Settings: Settings = (() => {
  let data: Profile[] = [];

  const getUpdatedData = async (): Promise<Profile[]> => {
    data = (await getSettings()) as Profile[];
    return data;
  };

  const find = async (selector: Partial<Profile>): Promise<Profile[]> => {
    await getUpdatedData();
    return data.filter((profile) => {
      for (const key in selector) {
        if (
          Object.prototype.hasOwnProperty.call(selector, key) &&
          (selector as Record<string, unknown>)[key] !==
            profile[key as keyof Profile]
        ) {
          return false;
        }
      }
      return true;
    });
  };

  const findOne = (
    _data: Profile[],
    selector: Partial<Profile>
  ): Profile | undefined => {
    return _data.find((profile) => {
      for (const key in selector) {
        if (
          Object.prototype.hasOwnProperty.call(selector, key) &&
          (selector as Record<string, unknown>)[key] !==
            profile[key as keyof Profile]
        ) {
          return false;
        }
      }
      return true;
    });
  };

  const update = async (
    selector: Partial<Profile>,
    updatedProperties: Partial<Profile>
  ): Promise<Profile[]> => {
    await getUpdatedData();
    const index = data.findIndex((profile) => {
      for (const key in selector) {
        if (
          Object.prototype.hasOwnProperty.call(selector, key) &&
          (selector as Record<string, unknown>)[key] !==
            profile[key as keyof Profile]
        ) {
          return false;
        }
      }
      return true;
    });

    if (index !== -1) {
      data[index] = { ...data[index], ...updatedProperties };
    }

    await initSettings(data);
    return data;
  };

  const remove = async (selector: Partial<Profile>): Promise<Profile[]> => {
    data = data.filter((profile) => {
      for (const key in selector) {
        if (
          Object.prototype.hasOwnProperty.call(selector, key) &&
          (selector as Record<string, unknown>)[key] !==
            profile[key as keyof Profile]
        ) {
          return true;
        }
      }
      return false;
    });

    await initSettings(data);
    return data;
  };

  return {
    find,
    findOne,
    update,
    remove,
  };
})();

//
//

const defaultSettings: Profile[] = [
  {
    profileName: 'Default Profile',
    workTime: 25,
    breakTime: 4,
    longBreakTime: 15,
    workSessions: 5,
    alarmFilePath: '/assets/alarm-wood.mp3',
    active: true,
  },
];

async function getSettingsPath(): Promise<string> {
  const appDataDirPath = await appDataDir();
  return appDataDirPath + `/config/settings.json`;
}

const getSettings = async (): Promise<Profile[] | null> => {
  try {
    const settingsPath = await getSettingsPath();
    const response = await readTextFile(settingsPath);
    const settingsJson: Profile[] = JSON.parse(response);

    return settingsJson;
  } catch (error) {
    console.error('Error reading settings file:', error);
    return null;
  }
};

async function initSettings(
  settingsData: Profile[] | null = null
): Promise<Profile[] | null | undefined> {
  try {
    const settingsPath = await getSettingsPath();
    const settingsExists = await exists(settingsPath);

    // First time intializing the settings
    if (!settingsExists) {
      await createDir('config', {
        dir: BaseDirectory.AppData,
        recursive: true,
      });

      settingsData = defaultSettings;
    }

    // Write the settings to a JSON file
    if (settingsData) {
      await writeFile({
        path: settingsPath,
        contents: JSON.stringify(settingsData, null, 2),
      });
    }

    return settingsData ?? (await getSettings());
  } catch (error) {
    console.error('Error creating settings file:', error);
  }
}

export { defaultSettings, Settings, getSettings, initSettings };
