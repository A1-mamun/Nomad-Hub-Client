import { useState } from "react";
import AddRoomForm from "../../../components/Form/AddRomForm";
import useAuth from "../../../hooks/useAuth";
import { imageUpload } from "../../../api/utils";
import { Helmet } from "react-helmet-async";
import { useMutation } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AddRoom = () => {
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [dates, setDates] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });
  const [imagePreview, setImagePreview] = useState();
  const [imageText, setImageText] = useState("Upload Image");
  const [loading, setLoading] = useState(false);

  console.log(user);
  // date range handler
  const handleDates = (item) => {
    console.log(item);
    setDates(item.selection);
  };

  const { mutateAsync } = useMutation({
    mutationFn: async (room) => {
      const { data } = await axiosSecure.post("/add-room", room);
      return data;
    },
    onSuccess: () => {
      // console.log("Room added successfully");
      setLoading(false);
      toast.success("Room added successfully!");
      navigate("/dashboard/my-listings");
    },
  });

  // Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const form = e.target;
    const location = form.location.value;
    const category = form.category.value;
    const title = form.title.value;
    const from = dates.startDate;
    const to = dates.endDate;
    const price = form.price.value;
    const guests = form.total_guest.value;
    const bathrooms = form.bathrooms.value;
    const bedrooms = form.bedrooms.value;
    const description = form.description.value;
    const image = form.image.files[0];
    const host = {
      name: user.displayName,
      email: user.email,
      image: user?.photoURL,
    };
    try {
      const image_url = await imageUpload(image);
      const room = {
        location,
        category,
        title,
        to,
        from,
        price,
        guests,
        bathrooms,
        bedrooms,
        description,
        host,
        image: image_url,
      };
      // console.log(room);
      await mutateAsync(room);
    } catch (err) {
      // console.log(err);
      setLoading(false);
      toast.error(err.message);
    }
  };
  // handle preview image
  const handlePreviewImage = (image) => {
    setImagePreview(URL.createObjectURL(image));
    setImageText(image.name);
  };

  return (
    <>
      <Helmet>
        <title>Add Room | Dashboard</title>
      </Helmet>
      <AddRoomForm
        dates={dates}
        handleDates={handleDates}
        handleSubmit={handleSubmit}
        imagePreview={imagePreview}
        imageText={imageText}
        handlePreviewImage={handlePreviewImage}
        loading={loading}
      />
    </>
  );
};

export default AddRoom;
