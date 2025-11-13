import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPerson, editPerson } from "../store/peopleSlice";
import { closePeopleDialog } from "../store/modalSlice";
import close_icon from "../assets/icon-cross.svg";
import toast from "react-hot-toast";

const PeopleDialog = () => {
  const dispatch = useDispatch();
  const { peopleDialogType, personData } = useSelector((state) => state.modal);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (peopleDialogType === "edit" && personData) {
      setName(personData.name);
      setEmail(personData.email || "");
      setRole(personData.role || "");
    } else {
      // Reset form for create mode
      setName("");
      setEmail("");
      setRole("");
    }
  }, [peopleDialogType, personData]);

  const handleClose = () => {
    dispatch(closePeopleDialog());
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Name is required!");
      return;
    }

    if (peopleDialogType === "edit") {
      dispatch(
        editPerson({
          id: personData.id,
          name,
          email,
          role,
        })
      );
      toast.success("Person updated successfully!");
    } else {
      dispatch(
        addPerson({
          name,
          email,
          role,
        })
      );
      toast.success("Person added successfully!");
    }
    dispatch(closePeopleDialog());
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-neutral-950/70 z-50">
      <div className="w-[480px] max-h-[90vh] flex flex-col p-8 bg-white dark:bg-background-darkCard rounded-lg shadow-sm">
        <div className="flex flex-row items-center justify-between w-full">
          <h1 className="text-text dark:text-white font-bold text-lg">
            {peopleDialogType === "edit" ? "Edit Person" : "Add New Person"}
          </h1>
          <img
            src={close_icon}
            alt="close"
            type="button"
            className="cursor-pointer hover:bg-background p-2 rounded-lg"
            onClick={handleClose}
          />
        </div>

        {error && <p className="text-destructive text-sm mt-2 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col mt-6 w-full">
          <label
            htmlFor="name"
            className="text-text-secondary dark:text-white text-[12px] font-medium mb-2"
          >
            Name <span className="text-destructive">*</span>
          </label>
          <input
            type="text"
            id="name"
            className="border border-lines dark:border-lines-dark rounded-lg p-3 placeholder-text-secondary dark:text-white mb-4 dark:bg-background-darkCard"
            placeholder="e.g. John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label
            htmlFor="email"
            className="text-text-secondary dark:text-white text-[12px] font-medium mb-2"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            className="border border-lines dark:border-lines-dark rounded-lg p-3 placeholder-text-secondary dark:text-white mb-4 dark:bg-background-darkCard"
            placeholder="e.g. john@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label
            htmlFor="role"
            className="text-text-secondary dark:text-white text-[12px] font-medium mb-2"
          >
            Role
          </label>
          <input
            type="text"
            id="role"
            className="border border-lines dark:border-lines-dark rounded-lg p-3 placeholder-text-secondary dark:text-white mb-6 dark:bg-background-darkCard"
            placeholder="e.g. Developer, Designer"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />

          <button
            type="submit"
            className="bg-primary text-sm font-semibold text-white px-4 py-3 rounded-full hover:bg-primary-hover"
          >
            {peopleDialogType === "edit" ? "Save Changes" : "Add Person"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PeopleDialog;
