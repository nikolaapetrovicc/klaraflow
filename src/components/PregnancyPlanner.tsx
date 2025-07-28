import React from "react";
import { FertilityCalendar } from "./FertilityCalendar";

export function PregnancyPlanner() {
  return (
    <div className="p-6 space-y-6">
      <div className="text-center mb-8">
        <div className="w-24 h-24 mx-auto mb-4 bg-[#FF2E74] rounded-full flex items-center justify-center text-white text-4xl font-bold">
          🤰
        </div>
        <h1 className="text-3xl font-bold text-[#FF2E74] mb-2">Pregnancy Planner</h1>
        <p className="text-[#867B9F] text-base">Plan and track your fertility journey</p>
      </div>
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#F5EAE3] space-y-4">
        <h2 className="text-lg font-semibold text-[#2C2C2C] mb-2">Features</h2>
        <ul className="list-disc list-inside text-[#2C2C2C] text-base space-y-1">
          <li>Track ovulation windows and fertile days</li>
          <li>Log intercourse, ovulation tests, and symptoms</li>
          <li>Record artificial fertilization procedures (IUI, IVF, ICSI)</li>
          <li>See your probability of conception</li>
          <li>Get educational tips and resources</li>
        </ul>
      </div>
      
      <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-3xl p-6 border border-purple-200">
        <h3 className="text-lg font-semibold text-purple-800 mb-3">🏥 Artificial Fertilization Tracking</h3>
        <p className="text-purple-700 text-sm mb-3">
          Click on any date in the calendar below to log your fertility activities, including:
        </p>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center space-x-2">
            <span className="text-purple-600">❤️</span>
            <span className="text-purple-700">Intercourse</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-purple-600">🧪</span>
            <span className="text-purple-700">Ovulation Tests</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-purple-600">🏥</span>
            <span className="text-purple-700">IUI/IVF/ICSI</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-purple-600">🤒</span>
            <span className="text-purple-700">Fertility Symptoms</span>
          </div>
        </div>
      </div>
      <FertilityCalendar />
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#F5EAE3] space-y-3">
        <h2 className="text-lg font-semibold text-[#2C2C2C] mb-2 flex items-center">
          🤖 AI Vitamin Suggestions
        </h2>
        <ul className="list-disc list-inside text-[#2C2C2C] text-base space-y-1">
          <li><span className="font-semibold text-[#FF2E74]">Folic Acid:</span> Supports neural tube development. Start before conception and continue through early pregnancy.</li>
          <li><span className="font-semibold text-[#FF2E74]">Iron:</span> Helps prevent anemia and supports baby's growth.</li>
          <li><span className="font-semibold text-[#FF2E74]">Vitamin D:</span> Important for bone health and immune function.</li>
          <li><span className="font-semibold text-[#FF2E74]">Calcium:</span> Supports bone and teeth development for both mom and baby.</li>
          <li><span className="font-semibold text-[#FF2E74]">Iodine:</span> Essential for baby's brain development.</li>
          <li><span className="font-semibold text-[#FF2E74]">Prenatal Multivitamin:</span> Covers a broad range of nutrients needed during pregnancy planning.</li>
        </ul>
        <div className="text-xs text-[#867B9F] mt-2">Always consult your doctor before starting any new supplement.</div>
      </div>
    </div>
  );
} 