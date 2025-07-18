import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { SignOutButton } from "../SignOutButton";

export function Profile() {
  const user = useQuery(api.auth.loggedInUser);
  const cycles = useQuery(api.cycles.getUserCycles);

  if (user === undefined || cycles === undefined) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF2E74]"></div>
      </div>
    );
  }

  // Calculate stats
  let avgCycleLength = 0;
  if (cycles && cycles.length >= 2) {
    avgCycleLength = Math.round(
      cycles.slice(0, 3).reduce((acc, cycle, index, arr) => {
        if (index === 0) return acc;
        const prevDate = new Date(arr[index - 1].date);
        const currDate = new Date(cycle.date);
        const diff = Math.abs((prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24));
        return acc + diff;
      }, 0) / (Math.min(cycles.length, 3) - 1)
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="text-center mb-8">
        <div className="w-24 h-24 mx-auto mb-4 bg-[#FF2E74] rounded-full flex items-center justify-center text-white text-4xl font-bold">
          {user?.name?.charAt(0) ?? "U"}
        </div>
        <h1 className="text-3xl font-bold text-[#FF2E74] mb-2">{user?.name ?? "User"}</h1>
        {user?.email && <p className="text-[#867B9F] text-sm">{user.email}</p>}
      </div>
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#F5EAE3] space-y-4">
        <div className="flex justify-between">
          <span className="text-[#867B9F]">Total Cycles</span>
          <span className="font-semibold text-[#2C2C2C]">{cycles?.length ?? 0}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#867B9F]">Avg Cycle Length</span>
          <span className="font-semibold text-[#2C2C2C]">{avgCycleLength || 28} days</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#867B9F]">Period Length</span>
          <span className="font-semibold text-[#2C2C2C]">5 days</span>
        </div>
      </div>
      <div className="flex justify-center mt-8">
        <SignOutButton />
      </div>
    </div>
  );
} 