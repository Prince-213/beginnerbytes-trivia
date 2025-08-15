"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Crown, Medal, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

// Sample leaderboard data

const allTimeData = [
  { id: 1, name: "Alexandra Kim", points: 8945, avatar: "👩‍💼", rank: 1 },
  { id: 2, name: "Marcus Johnson", points: 7823, avatar: "👨‍💻", rank: 2 },
  { id: 3, name: "Emma Wilson", points: 6754, avatar: "👩‍🎓", rank: 3 },
  { id: 4, name: "Davis Curtis", points: 5432, avatar: "👨‍💼", rank: 4 },
  { id: 5, name: "Sophia Lee", points: 4987, avatar: "👩‍🔬", rank: 5 },
  { id: 6, name: "James Brown", points: 4321, avatar: "👨‍🎨", rank: 6 },
  { id: 7, name: "Olivia Davis", points: 3876, avatar: "👩‍⚕️", rank: 7 },
  { id: 8, name: "Alena Donin", points: 3654, avatar: "👩‍💻", rank: 8 },
];

interface Leaderboard {
  answered: number;
  gender: string;
  name: string;
  score: number;
}

export default function LeaderboardPage() {
  const router = useRouter();

  const scores = useQuery(api.score.scores);

  const currentData = allTimeData;

  const restOfList = currentData.slice(3);

  const getPodiumHeight = (rank: number) => {
    switch (rank) {
      case 1:
        return "h-32";
      case 2:
        return "h-24";
      case 3:
        return "h-20";
      default:
        return "h-16";
    }
  };

  const getPodiumColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-t from-red-400 to-red-300";
      case 2:
        return "bg-gradient-to-t from-blue-400 to-blue-300";
      case 3:
        return "bg-gradient-to-t from-purple-400 to-purple-300";
      default:
        return "bg-gray-300";
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500 animate-bounce" />;
      case 2:
        return <Trophy className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Medal className="w-5 h-5 text-amber-600" />;
      default:
        return null;
    }
  };

  const getTop3Scores = (people: Leaderboard[]) => {
    // Filter out people with score 0 or no score
    const scoredPeople = people.filter((person) => person.score > 0);

    // Sort by score in descending order
    scoredPeople.sort((a, b) => b.score - a.score);

    // Return the top 3 (or fewer if array has less than 3)
    return scoredPeople.slice(0, 3);
  };

  const topThree = getTop3Scores(scores ?? []);

  const genderAvatar = (gender: string) => {
    if (gender === "male") {
      return (
        <img
          width="44"
          height="44"
          src="https://img.icons8.com/3d-fluency/94/person-male--v7.png"
          alt="person-male--v7"
        />
      );
    } else {
      return (
        <img
          width="44"
          height="44"
          src="https://img.icons8.com/3d-fluency/94/person-female--v7.png"
          alt="person-female--v7"
        />
      );
    }
  };

  function rankAndShowFromFourth(people: Leaderboard[]) {
    // Filter out people with score 0 or no score
    const scoredPeople = people.filter((person) => person.score > 0);

    // Sort by score in descending order
    scoredPeople.sort((a, b) => b.score - a.score);

    // Add rank property to each person
    scoredPeople.forEach((person, index) => {
      person.answered = index + 1;
    });

    // Return array starting from 4th position (index 3)
    return scoredPeople.slice(3);
  }
  const restOfScores = rankAndShowFromFourth(scores ?? []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-6 max-w-[90%] lg:max-w-[50%] ">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-gray-900 font-heading">
            Leaderboard
          </h1>
          <div className="w-16" /> {/* Spacer for centering */}
        </div>

        <br />

        {/* Tab Toggle */}

        {/* Podium */}
        <div className="flex items-end justify-center gap-2 mb-8 px-4 ">
          {/* 2nd Place */}
          <div className="flex flex-col items-center">
            <div className="relative mb-2">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-xl mb-1">
                {genderAvatar(topThree[1]?.gender)}
              </div>
              <div className="absolute -top-1 -right-1">{getRankIcon(2)}</div>
            </div>
            <div
              className={`${getPodiumColor(2)} ${getPodiumHeight(
                2
              )} w-32 rounded-t-lg flex flex-col justify-end p-2`}
            >
              <div className="text-white text-center">
                <div className="font-semibold text-base">
                  {topThree[1]?.name.split(" ")[0]}
                </div>
                <div className="text-xs opacity-90">
                  {topThree[1]?.score} points
                </div>
              </div>
            </div>
          </div>

          {/* 1st Place */}
          <div className="flex flex-col items-center">
            <div className="relative mb-2">
              <div className="w-20 h-20 rounded-full bg-yellow-100 flex items-center justify-center text-2xl mb-1 ring-4 ring-yellow-200">
                {genderAvatar(topThree[0]?.gender)}
              </div>
              <div className="absolute -top-2 -right-2 animate-pulse">
                {getRankIcon(1)}
              </div>
            </div>
            <div
              className={`${getPodiumColor(1)} ${getPodiumHeight(
                1
              )} w-38 rounded-t-lg flex flex-col justify-end p-3`}
            >
              <div className="text-white text-center">
                <div className="font-bold text-base">
                  {topThree[0]?.name.split(" ")[0]}
                </div>
                <div className="text-xs opacity-90">
                  {topThree[0]?.score} points
                </div>
              </div>
            </div>
          </div>

          {/* 3rd Place */}
          <div className="flex flex-col items-center">
            <div className="relative mb-2">
              <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center text-xl mb-1">
                {genderAvatar(topThree[2]?.gender)}
              </div>
              <div className="absolute -top-1 -right-1">{getRankIcon(3)}</div>
            </div>
            <div
              className={`${getPodiumColor(3)} ${getPodiumHeight(
                3
              )} w-32 rounded-t-lg flex flex-col justify-end p-2`}
            >
              <div className="text-white text-center">
                <div className="font-semibold text-base">
                  {topThree[2]?.name.split(" ")[0]}
                </div>
                <div className="text-xs opacity-90">
                  {topThree[2]?.score} points
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rest of Leaderboard */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-0">
            {restOfScores?.map((player: Leaderboard, index: number) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-sm font-semibold text-gray-600">
                  {player.answered}
                </div>
                {genderAvatar(topThree[2]?.gender)}
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">
                    {player.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {player.score} points
                  </div>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-purple-100 text-purple-700"
                >
                  #{player.answered}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Bottom Actions */}
        <div className="mt-8 flex gap-3">
          <Button
            variant="outline"
            onClick={() => router.push("/")}
            className="flex-1"
          >
            Home
          </Button>
        </div>
      </div>
    </div>
  );
}
