import { useState, useEffect } from "react";
import {
  Search as SearchIcon,
  Droplets,
  MapPin,
  Map,
  User,
  Mail,
  Filter,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import useAxiosPublic from "../hooks/useAxiosPublic";
import districtsData from "../data/districts.json";
import upazilasData from "../data/upazilas.json";

const allDistricts = districtsData[2]?.data || [];
const allUpazilas = upazilasData[2]?.data || [];

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const selectClass =
  "w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all duration-200 bg-white appearance-none";

const Search = () => {
  const axiosPublic = useAxiosPublic();

  const [bloodGroup, setBloodGroup] = useState("");
  const [selectedDistrictId, setSelectedDistrictId] = useState("");
  const [selectedDistrictName, setSelectedDistrictName] = useState("");
  const [selectedUpazila, setSelectedUpazila] = useState("");
  const [filteredUpazilas, setFilteredUpazilas] = useState([]);

  const [donors, setDonors] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  // filter upazilas dynamically
  useEffect(() => {
    if (selectedDistrictId) {
      setFilteredUpazilas(
        allUpazilas.filter(
          (u) => String(u.district_id) === String(selectedDistrictId)
        )
      );
      setSelectedUpazila("");
    } else {
      setFilteredUpazilas([]);
      setSelectedUpazila("");
    }
  }, [selectedDistrictId]);

  const handleDistrictChange = (e) => {
    const distId = e.target.value;
    const distObj = allDistricts.find((d) => d.id === distId);
    setSelectedDistrictId(distId);
    setSelectedDistrictName(distObj?.name || "");
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    setLoading(true);
    setSearched(true);

    try {
      const params = new URLSearchParams();
      if (bloodGroup) params.append("bloodGroup", bloodGroup);
      if (selectedDistrictName) params.append("district", selectedDistrictName);
      if (selectedUpazila) params.append("upazila", selectedUpazila);

      const res = await axiosPublic.get(`/search-donors?${params.toString()}`);
      setDonors(res.data || []);
    } catch {
      toast.error("Search failed. Please try again.");
      setDonors([]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setBloodGroup("");
    setSelectedDistrictId("");
    setSelectedDistrictName("");
    setSelectedUpazila("");
    setFilteredUpazilas([]);
    setDonors([]);
    setSearched(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-red-50 py-12 px-4">
      <div className="max-w-5xl mx-auto space-y-10">

        {/* Page header */}
        <div className="text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-100 text-red-600 text-xs font-semibold uppercase tracking-wider mb-4">
            <SearchIcon size={13} />
            Donor Search
          </span>
          <h1 className="text-4xl font-extrabold text-gray-800 mb-3">
            Find Blood Donors
          </h1>
          <p className="text-gray-500 max-w-md mx-auto text-sm">
            Search for available donors by blood group, district, and upazila.
          </p>
        </div>

        {/* Search form card */}
        <div className="bg-white rounded-3xl shadow-lg border border-red-100 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-red-50">
              <Filter size={18} className="text-red-600" />
            </div>
            <h2 className="text-lg font-bold text-gray-800">Search Filters</h2>
          </div>

          <form onSubmit={handleSearch} className="space-y-5">
            <div className="grid sm:grid-cols-3 gap-4">

              {/* Blood Group */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block ml-1">
                  Blood Group
                </label>
                <div className="relative">
                  <Droplets size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className={selectClass}
                  >
                    <option value="">All Blood Groups</option>
                    {BLOOD_GROUPS.map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* District */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block ml-1">
                  District
                </label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <select
                    value={selectedDistrictId}
                    onChange={handleDistrictChange}
                    className={selectClass}
                  >
                    <option value="">All Districts</option>
                    {allDistricts.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Upazila */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block ml-1">
                  Upazila
                </label>
                <div className="relative">
                  <Map size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <select
                    value={selectedUpazila}
                    onChange={(e) => setSelectedUpazila(e.target.value)}
                    disabled={!selectedDistrictId}
                    className={`${selectClass} ${!selectedDistrictId ? "bg-gray-50 cursor-not-allowed" : ""}`}
                  >
                    <option value="">
                      {selectedDistrictId ? "All Upazilas" : "Select district first"}
                    </option>
                    {filteredUpazilas.map((u) => (
                      <option key={u.id} value={u.name}>{u.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-1">
              {searched && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-300 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-colors"
                >
                  <X size={15} />
                  Reset
                </button>
              )}
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-8 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-500 text-white text-sm font-semibold shadow-md shadow-red-200 hover:shadow-red-300 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:scale-100"
              >
                <SearchIcon size={15} />
                {loading ? "Searching..." : "Search Donors"}
              </button>
            </div>
          </form>
        </div>

        {/* Default — no search yet */}
        {!searched && (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <Droplets size={36} className="text-red-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              Find a Donor
            </h3>
            <p className="text-gray-400 text-sm max-w-sm mx-auto">
              Use the search filters above to find available blood donors in your area.
            </p>
          </div>
        )}

        {/* Search done, no results */}
        {searched && !loading && donors.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <SearchIcon size={36} className="text-gray-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              No Donors Found
            </h3>
            <p className="text-gray-400 text-sm max-w-sm mx-auto">
              Try adjusting your search filters to find more donors.
            </p>
          </div>
        )}

        {/* Results */}
        {searched && !loading && donors.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-5">
              <h2 className="text-lg font-bold text-gray-700">
                {donors.length} Donor{donors.length > 1 ? "s" : ""} Found
              </h2>
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {donors.map((donor) => (
                <div
                  key={donor._id}
                  className="bg-white rounded-3xl shadow-md border border-red-50 p-6 flex flex-col items-center text-center gap-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  {/* Avatar */}
                  <div className="relative">
                    <img
                      src={donor.avatar || "https://i.ibb.co/6NGH09t/user-placeholder.png"}
                      alt={donor.name}
                      className="w-20 h-20 rounded-full object-cover border-4 border-red-100 shadow"
                    />
                    <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-600 text-white text-xs font-extrabold shadow">
                      <Droplets size={10} />
                      {donor.bloodGroup}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="pt-2 w-full space-y-2">
                    <h3 className="text-base font-bold text-gray-800">
                      {donor.name}
                    </h3>

                    <div className="flex items-center justify-center gap-1.5 text-sm text-gray-500">
                      <Mail size={13} className="text-rose-400" />
                      <span className="truncate max-w-[180px]">{donor.email}</span>
                    </div>

                    <div className="flex items-center justify-center gap-1.5 text-sm text-gray-500">
                      <MapPin size={13} className="text-rose-400" />
                      <span>{donor.district}, {donor.upazila}</span>
                    </div>
                  </div>

                  {/* Status badge */}
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                    Available
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;