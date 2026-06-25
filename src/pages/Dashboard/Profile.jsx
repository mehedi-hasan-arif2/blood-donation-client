import { useForm } from "react-hook-form";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import toast from "react-hot-toast";

const Profile = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    try {
      await axiosSecure.patch(`/users/profile/${user.email}`, data);
      toast.success("Profile updated!");
    } catch (error) {
      toast.error("Update failed");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-8 bg-white rounded-2xl shadow">
      <h2 className="text-2xl font-bold mb-6">Update Profile</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input {...register("name")} defaultValue={user?.displayName} className="w-full p-3 border rounded" placeholder="Name" />
        <input disabled value={user?.email} className="w-full p-3 border rounded bg-gray-100" />
        <button type="submit" className="w-full btn btn-primary">Update Profile</button>
      </form>
    </div>
  );
};

export default Profile;