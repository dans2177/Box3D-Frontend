import { useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { createSubtraction } from "../../slices/filamentSlice";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";

const SubtractFilament = () => {
  const { filamentId } = useParams();
  const dispatch = useDispatch();
  const { getToken } = useKindeAuth();
  const [subtractionAmount, setSubtractionAmount] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!subtractionAmount) {
      toast.error("Please enter a valid subtraction amount.");
      return;
    }

    try {
      const token = await getToken();
      await dispatch(
        createSubtraction({
          filamentId,
          subtractionAmount,
          token,
        })
      ).unwrap();
      setSubtractionAmount("");
      toast.success("Subtraction successful!");
    } catch (error) {
      console.error("Error in subtraction:", error);
      toast.error("Subtraction failed.");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Subtract from Filament</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="subtractionAmount"
            className="block text-sm font-medium text-gray-700"
          >
            Subtraction Amount
          </label>
          <input
            type="number"
            id="subtractionAmount"
            name="subtractionAmount"
            value={subtractionAmount}
            onChange={(e) => setSubtractionAmount(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default SubtractFilament;
