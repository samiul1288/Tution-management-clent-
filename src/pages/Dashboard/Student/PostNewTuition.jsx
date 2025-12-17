import useAxiosSecure from "../../../hooks/useAxiosSecure";

const PostNewTuition = () => {
    const axiosSecure = useAxiosSecure();
    

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;

    const payload = {
      title: form.title.value,
      subject: form.subject.value,
      className: form.className.value,
      location: form.location.value,
      budget: parseFloat(form.budget.value),
      schedule: form.schedule.value,
      description: form.description.value,
    };

    try {
      await axiosSecure.post("/tuitions", payload);
      alert("Tuition posted! Waiting for admin approval.");
      form.reset();
    } catch (err) {
      console.error(err);
      alert("Failed to post tuition");
    }
  };

  return (
    <div className="card bg-base-100 p-6 shadow">
      <h2 className="text-xl font-bold mb-4">Post New Tuition</h2>
      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
        <input
          name="title"
          className="input input-bordered w-full"
          placeholder="Title"
          required
        />
        <input
          name="subject"
          className="input input-bordered w-full"
          placeholder="Subject"
          required
        />
        <input
          name="className"
          className="input input-bordered w-full"
          placeholder="Class (e.g. 9, HSC)"
          required
        />
        <input
          name="location"
          className="input input-bordered w-full"
          placeholder="Location"
          required
        />
        <input
          name="budget"
          type="number"
          className="input input-bordered w-full"
          placeholder="Budget"
          required
        />
        <input
          name="schedule"
          className="input input-bordered w-full"
          placeholder="Schedule"
          required
        />

        <textarea
          name="description"
          className="textarea textarea-bordered md:col-span-2"
          placeholder="Describe your requirement"
          required
        ></textarea>

        <button type="submit" className="btn btn-primary md:col-span-2">
          Submit
        </button>
      </form>
    </div>
  );
};

export default PostNewTuition;
