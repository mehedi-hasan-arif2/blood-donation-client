import { useState } from "react";
import useAxiosSecure from "../hooks/useAxiosSecure";
import districtsData from "../data/districts.json";
import upazilasData from "../data/upazilas.json";

const Search = () => {
  const axiosSecure = useAxiosSecure();
  const [donors, setDonors] = useState([]);
  const [filters, setFilters] = useState({ bloodGroup: "", district: "", upazila: "" });

  const handleSearch = async (e) => {
    e.preventDefault();
    const res = await axiosSecure.get(`/search-donors?bloodGroup=${filters.bloodGroup}&district=${filters.district}&upazila=${filters.upazila}`);
    setDonors(res.data);
  };

  return (
    <div className="p-8">
      <form onSubmit={handleSearch} className="flex gap-4 mb-8">
        <select onChange={(e) => setFilters({...filters, bloodGroup: e.target.value})} className="select select-bordered">
          <option value="">Blood Group</option>
          {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(b => <option key={b} value={b}>{b}</option>)}
        </select>
        <button type="submit" className="btn btn-primary">Search</button>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {donors.map(d => (
          <div key={d._id} className="card bg-base-100 shadow p-4">
            <h3 className="font-bold">{d.name}</h3>
            <p>{d.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Search;