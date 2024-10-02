import { BsFingerprint } from "react-icons/bs";
import { GrUserAdmin } from "react-icons/gr";
import MenuItem from ".//MenuItem";
import useRole from "../../../../hooks/useRole";
import { useState } from "react";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import useAuth from "../../../../hooks/useAuth";
import toast from "react-hot-toast";
import HostModal from "../../../Modals/HostModal";

const GuestMenu = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const [role] = useRole();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const closeModal = () => setIsModalOpen(false);
  const modalHandler = async () => {
    console.log("Host hote chai");
    try {
      const curentUser = {
        email: user?.email,
        role: "Guest",
        status: "Requested",
      };
      const { data } = await axiosSecure.put("/user", curentUser);
      if (data.modifiedCount > 0) {
        toast.success("Please! wait for admin confirmation");
      } else {
        toast.success("Please! wait for admin approval");
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      closeModal();
    }
  };
  return (
    <>
      <MenuItem
        icon={BsFingerprint}
        label="My Bookings"
        address="my-bookings"
      />

      {role === "Guest" && (
        <div
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 mt-5  transition-colors duration-300 transform text-gray-600  hover:bg-gray-300   hover:text-gray-700 cursor-pointer"
        >
          <GrUserAdmin className="w-5 h-5" />

          <span className="mx-4 font-medium">Become A Host</span>
        </div>
      )}
      <HostModal
        isOpen={isModalOpen}
        closeModal={closeModal}
        modalHandler={modalHandler}
      />
    </>
  );
};

export default GuestMenu;
