import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Profile } from '../hooks/useStore';
import { z } from 'zod';

const ProfileForm = ({ profiles }: { profiles: Profile[] }) => {
  // const profiles = useStore((state) => state.profiles);

  const profileSchema = z.object({
    profileName: z.string().max(100),
    workTime: z.number().int().min(1).max(60),
    breakTime: z.number().int().min(1).max(60),
    longBreakTime: z.number().int().min(1).max(60),
    workSessions: z.number().int().min(1),
    alarmFilePath: z.string(),
  });

  type ProfileSchema = z.infer<typeof profileSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      profileName: 'Profile ' + (profiles.length + 1),
      workTime: 25,
      breakTime: 4,
      longBreakTime: 15,
      workSessions: 4,
    },
  });

  function onSubmit(data: ProfileSchema) {
    console.log('Data:', data);
  }

  return (
    <form
      className='w-full flex flex-col gap-y-2 '
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className='flex flex-col md:flex-row gap-4 md:justify-between'>
        {/* ProfileName */}
        <label className='w-full form-control'>
          <div className='label'>
            <span className='label-text'>Profile Name</span>
          </div>

          <input
            className='w-full input input-bordered'
            placeholder='Your profile name'
            type='text'
            {...register('profileName')}
          />
        </label>
        {errors?.profileName && (
          <p className='text-error mt-1 mb-2'>{errors.profileName.message}</p>
        )}

        {/* WorkSessions */}
        <label className='w-full md:max-w-xs form-control'>
          <div className='label'>
            <span className='label-text'>Work Sessions</span>
          </div>

          <input
            className='w-full input input-bordered'
            placeholder='Default is 4'
            type='number'
            min={1}
            {...register('workSessions', { valueAsNumber: true })}
          />
        </label>
        {errors?.workSessions && (
          <p className='text-error mt-1 mb-2'>{errors.workSessions.message}</p>
        )}
      </div>

      <div className='flex flex-col md:flex-row gap-4 md:justify-between'>
        {/* WorkTime */}
        <label className='w-full form-control'>
          <div className='label'>
            <span className='label-text'>Work duration</span>
          </div>

          <input
            className='w-full input input-bordered'
            placeholder='In minutes'
            type='number'
            min={1}
            max={60}
            {...register('workTime', { valueAsNumber: true })}
          />
        </label>
        {errors?.workTime && (
          <p className='text-error mt-1 mb-2'>{errors.workTime.message}</p>
        )}

        {/* BreakTime */}
        <label className='w-full form-control'>
          <div className='label'>
            <span className='label-text'>Break duration</span>
          </div>

          <input
            className='w-full input input-bordered'
            placeholder='In minutes'
            type='number'
            min={1}
            max={60}
            {...register('breakTime', { valueAsNumber: true })}
          />
        </label>
        {errors?.breakTime && (
          <p className='text-error mt-1 mb-2'>{errors.breakTime.message}</p>
        )}

        {/* LongBreakTime */}
        <label className='w-full form-control'>
          <div className='label'>
            <span className='label-text'>Long break duration</span>
          </div>

          <input
            className='w-full input input-bordered'
            placeholder='In minutes'
            type='number'
            min={1}
            max={60}
            {...register('longBreakTime', { valueAsNumber: true })}
          />
        </label>
        {errors?.longBreakTime && (
          <p className='text-error mt-1 mb-2'>{errors.longBreakTime.message}</p>
        )}
      </div>

      {/* AlarmFilePath */}
      <label className='w-full form-control'>
        <div className='label'>
          <span className='label-text'>Alarm Sound</span>
        </div>

        <select
          className='select select-bordered'
          {...register('alarmFilePath')}
        >
          <option value={'Pick one'}>Pick one</option>
          <option value={'Star Wars'}>Star Wars</option>
          <option value={'Harry Potter'}>Harry Potter</option>
          <option value={'Lord of'}>Lord of the Rings</option>
          <option value={'Planet of'}>Planet of the Apes</option>
          <option value={'Star Trek'}>Star Trek</option>
        </select>

        {/* <input
          className='w-full file-input file-input-bordered'
          placeholder='Type here'
          type='file'
          accept='.mp3,.wav,.ogg,.m4a'
          {...register('alarmFilePath')}
        /> */}
      </label>
      {errors?.alarmFilePath && (
        <p className='text-error mt-1 mb-2'>
          {String(errors.alarmFilePath.message)}
        </p>
      )}

      {/* Submit Button */}
      <button type='submit' className='btn btn-block btn-primary mt-2'>
        Add Profile
      </button>
    </form>
  );
};

export default ProfileForm;
