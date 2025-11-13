import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { deletePerson } from "../store/peopleSlice";
import { closePeopleList, openPeopleDialog } from "../store/modalSlice";
import close_icon from "../assets/icon-cross.svg";
import { PencilIcon, TrashIcon, UserPlusIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

const PeopleList = () => {
  const dispatch = useDispatch();
  const people = useSelector((state) => state.people.people);

  const handleClose = () => {
    dispatch(closePeopleList());
  };

  const handleAddPerson = () => {
    dispatch(openPeopleDialog({ type: "create" }));
  };

  const handleEditPerson = (person) => {
    dispatch(openPeopleDialog({ type: "edit", person }));
  };

  const handleDeletePerson = (personId, personName) => {
    if (window.confirm(`Are you sure you want to remove ${personName}?`)) {
      dispatch(deletePerson(personId));
      toast.success(`${personName} removed successfully!`);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-neutral-950/70 z-50">
      <div className="w-[600px] max-h-[90vh] flex flex-col p-8 bg-white dark:bg-background-darkCard rounded-lg shadow-sm">
        <div className="flex flex-row items-center justify-between w-full mb-6">
          <h1 className="text-text dark:text-white font-bold text-lg">
            Team Members
          </h1>
          <img
            src={close_icon}
            alt="close"
            type="button"
            className="cursor-pointer hover:bg-background p-2 rounded-lg"
            onClick={handleClose}
          />
        </div>

        {/* Add Person Button */}
        <button
          onClick={handleAddPerson}
          className="flex items-center justify-center gap-2 bg-primary text-sm font-semibold text-white px-4 py-3 rounded-full hover:bg-primary-hover mb-4"
        >
          <UserPlusIcon className="w-5 h-5" />
          Add New Person
        </button>

        {/* People List */}
        <div className="flex-1 overflow-y-auto">
          {people.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-text-secondary dark:text-text-secondary text-sm">
                No team members yet. Add your first person!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {people.map((person) => (
                <div
                  key={person.id}
                  className="flex items-center justify-between p-4 bg-background dark:bg-background-dark rounded-lg hover:bg-lines dark:hover:bg-lines-dark transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                      style={{ backgroundColor: person.color }}
                    >
                      {person.initials}
                    </div>

                    {/* Person Info */}
                    <div className="flex flex-col">
                      <span className="text-text dark:text-white font-medium">
                        {person.name}
                      </span>
                      <div className="flex items-center gap-2 text-text-secondary text-xs">
                        {person.email && (
                          <span>{person.email}</span>
                        )}
                        {person.email && person.role && (
                          <span>•</span>
                        )}
                        {person.role && (
                          <span>{person.role}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditPerson(person)}
                      className="p-2 text-text-secondary hover:text-primary hover:bg-background dark:hover:bg-background-darkCard rounded-lg transition-colors"
                      title="Edit"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeletePerson(person.id, person.name)}
                      className="p-2 text-text-secondary hover:text-destructive hover:bg-background dark:hover:bg-background-darkCard rounded-lg transition-colors"
                      title="Delete"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PeopleList;
