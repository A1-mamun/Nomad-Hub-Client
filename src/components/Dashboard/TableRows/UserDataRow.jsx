import PropTypes from "prop-types";
import { useState } from "react";
import UpdateUserModal from "../../Modals/UpdateUserModal";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
const UserDataRow = ({ user, refetch }) => {
  const { user: loggedInUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const axiosSecure = useAxiosSecure();

  const { mutateAsync } = useMutation({
    mutationFn: async (userData) => {
      const { data } = await axiosSecure.patch(
        `/user/update/${user?.email}`,
        userData
      );
      return data;
    },
    onSuccess: () => {
      refetch();
      toast.success("User Role Updated Successfully");
      setIsOpen(false);
    },
  });

  const modalHandler = async (selected) => {
    if (loggedInUser.email === user.email) {
      toast.error("You can't change your own role");
      setIsOpen(false);
      return;
    }

    const userData = {
      role: selected,
      status: "Verified",
    };
    try {
      await mutateAsync(userData);
    } catch (err) {
      toast.error(err.message);
      setIsOpen(false);
    }
  };
  return (
    <tr>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p className="text-gray-900 whitespace-no-wrap">{user?.email}</p>
      </td>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p className="text-gray-900 whitespace-no-wrap">{user?.role}</p>
      </td>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        {user?.status ? (
          <p
            className={`${
              user.status === "Verified" ? "text-green-500" : "text-yellow-500"
            } whitespace-no-wrap`}
          >
            {user.status}
          </p>
        ) : (
          <p className="text-red-500 whitespace-no-wrap">Unavailable</p>
        )}
      </td>

      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <button
          onClick={() => setIsOpen(true)}
          className="relative cursor-pointer inline-block px-3 py-1 font-semibold text-green-900 leading-tight"
        >
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-green-200 opacity-50 rounded-full"
          ></span>
          <span className="relative">Update Role</span>
        </button>
        {/* Update User Modal */}
        <UpdateUserModal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          modalHandler={modalHandler}
          user={user}
        />
      </td>
    </tr>
  );
};

UserDataRow.propTypes = {
  user: PropTypes.object,
  refetch: PropTypes.func,
};

export default UserDataRow;
