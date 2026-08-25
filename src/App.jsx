import React, { useEffect, useState } from "react";
import axios from "axios";

export default function App() {
  const [surahs, setSurahs] = useState([]);
  const [surahData, setSurahData] = useState(null);
  const [selectedNumber, setSelectedNumber] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    async function getSurahs() {
      try {
        const response = await axios.get(
          "https://api.alquran.cloud/v1/surah"
        );
        setSurahs(response.data.data);
      } catch (error) {
        console.error("Error fetching surahs list:", error);
      }
    }

    getSurahs();
  }, []);

  async function getSurah(number) {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://api.alquran.cloud/v1/surah/" + number
      );
      setSurahData(response.data.data);
      setSelectedNumber(number);
    } catch (error) {
      console.error("Error fetching surah data:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getSurah(1);
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
    }, 200);
  };

  const filteredSurahs = surahs.filter((surah) => {
    const query = searchQuery.toLowerCase().trim();
    return (
      surah.number.toString().includes(query) ||
      surah.name.toLowerCase().includes(query) ||
      surah.englishName.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-6 px-4">

      {/* Main Container */}
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-5 shadow-lg mb-5 text-white">

          <div className="flex flex-col md:flex-row items-center justify-between gap-5">

            {/* Dropdown & Search Container */}
            <div className="w-full md:w-1/2 flex flex-col gap-3">
              
              {/* Search Box */}
              <div>
                <label className="block text-sm font-semibold mb-1 text-emerald-50">
                  🔍 Search Surah
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    placeholder="Type name or number..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="
                      w-full
                      h-10
                      pl-4
                      pr-10
                      rounded-xl
                      bg-white
                      text-gray-800
                      placeholder-gray-400
                      border-2
                      border-white
                      shadow-sm
                      text-sm
                      font-medium
                      focus:outline-none
                      focus:ring-2
                      focus:ring-emerald-300
                    "
                  />
                  {isSearching && (
                    <div className="absolute right-3 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-emerald-500 border-t-transparent"></div>
                    </div>
                  )}
                </div>
              </div>

              {/* Dropdown */}
              <div>
                <label className="block text-sm font-semibold mb-1 text-emerald-50">
                  📖 Select Surah
                </label>

                <select
                  value={selectedNumber}
                  onChange={(e) => getSurah(e.target.value)}
                  className="
                    w-full
                    h-12
                    px-4
                    rounded-xl
                    bg-white
                    text-gray-800
                    border-2
                    border-white
                    shadow-md
                    text-base
                    font-medium
                    focus:outline-none
                    focus:ring-4
                    focus:ring-emerald-300
                    cursor-pointer
                  "
                >
                  {filteredSurahs.length > 0 ? (
                    filteredSurahs.map((surah) => (
                      <option
                        key={surah.number}
                        value={surah.number}
                      >
                        {surah.number}. {surah.name} - {surah.englishName}
                      </option>
                    ))
                  ) : (
                    <option disabled value="">No Surah found</option>
                  )}
                </select>
              </div>

            </div>

            {/* Surah Information */}
            {filteredSurahs.length > 0 && surahData && !loading && (
              <div className="w-full md:w-1/2 text-center md:text-right">

                <h1 className="text-2xl font-bold">
                  {surahData.name}
                </h1>

                <p className="text-lg font-semibold text-emerald-100">
                  {surahData.englishName}
                </p>

                <p className="text-sm text-emerald-100 mt-1">
                  {surahData.englishNameTranslation}
                </p>

                <div className="inline-block mt-2 bg-white/20 px-3 py-1 rounded-full text-sm">
                  ✨ {surahData.numberOfAyahs} Ayahs
                </div>

              </div>
            )}

          </div>

        </div>

        {/* Quran Content / Loading State / Not Found State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl shadow-xl border border-emerald-100">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
            <p className="text-emerald-700 font-medium mt-4">Loading Surah...</p>
          </div>
        ) : filteredSurahs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-xl border border-emerald-100 text-center px-4">
            <p className="text-4xl mb-3">🔍</p>
            <h3 className="text-xl font-bold text-gray-700 mb-1">No Surah Found</h3>
            <p className="text-sm text-gray-500">Please try searching with a valid Surah name or number.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl border border-emerald-100 overflow-hidden">

            {/* Bismillah */}
            <div className="text-center py-6 bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 border-b border-amber-100">

              <p
                dir="rtl"
                className="text-3xl text-emerald-800 font-semibold"
              >
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </p>

              <p className="text-xs text-amber-700 mt-2 tracking-wider">
                IN THE NAME OF ALLAH, THE MOST GRACIOUS, THE MOST MERCIFUL
              </p>

            </div>

            {/* Ayahs */}
            <div className="px-4 md:px-8">

              {surahData &&
                surahData.ayahs.map((ayah) => (
                  <div
                    key={ayah.numberInSurah}
                    className="
                      group
                      flex
                      items-start
                      gap-4
                      py-6
                      border-b
                      border-emerald-50
                      hover:bg-emerald-50/60
                      transition-all
                      duration-300
                      rounded-xl
                      px-3
                    "
                  >

                    {/* Ayah Number */}
                    <div
                      className="
                        flex
                        items-center
                        justify-center
                        w-9
                        h-9
                        rounded-full
                        bg-gradient-to-br
                        from-emerald-500
                        to-teal-600
                        text-white
                        text-sm
                        font-bold
                        shrink-0
                        shadow-md
                        group-hover:scale-110
                        transition-transform
                      "
                    >
                      {ayah.numberInSurah}
                    </div>

                    {/* Arabic */}
                    <div className="w-full">

                      <p
                        dir="rtl"
                        className="
                          text-2xl
                          md:text-3xl
                          leading-[2.2]
                          text-right
                          text-gray-800
                          group-hover:text-emerald-900
                          transition-colors
                        "
                      >
                        <span>
                          {ayah.text}
                        </span>
                      </p>

                    </div>

                  </div>
                ))}

            </div>

          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-5">

          <p className="text-sm text-emerald-700">
            🌙 Read Quran with peace & reflection
          </p>

        </div>

      </div>
    </div>
  );
}