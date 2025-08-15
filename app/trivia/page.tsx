"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock, CheckCircle, AlertTriangle, ArrowLeft } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

// Sample trivia questions
const triviaQuestions = [
  {
    id: 1,
    question:
      "What percentage of people use AI daily without realizing it, according to the presentation?",
    options: ["65%", "72%", "84%", "91%"],
    correctAnswer: 2, // 84%
  },
  {
    id: 2,
    question:
      "Which of the following is NOT a subset of AI mentioned in the presentation?",
    options: [
      "Natural Language Processing (NLP)",
      "Neural Networks",
      "Blockchain",
      "Computer Vision",
    ],
    correctAnswer: 2, // Blockchain
  },
  {
    id: 3,
    question:
      "What is one key advantage of AI in healthcare, as highlighted in the presentation?",
    options: [
      "Reducing hospital staff",
      "Enabling faster and more accurate diagnoses",
      "Eliminating all manual tasks",
      "Replacing doctors entirely",
    ],
    correctAnswer: 1, // Faster and more accurate diagnoses
  },
  {
    id: 4,
    question:
      "Which of these is a real-world application of AI mentioned in the presentation?",
    options: [
      "Self-driving cars using computer vision",
      "AI-powered time travel",
      "Instant food delivery via drones",
      "Teleportation technology",
    ],
    correctAnswer: 0, // Self-driving cars
  },
  {
    id: 5,
    question:
      "What is a major disadvantage of AI discussed in the presentation?",
    options: [
      "It requires no electricity",
      "It inherits prejudices from training data",
      "It only works in cold climates",
      "It cannot process large datasets",
    ],
    correctAnswer: 1, // Inherits prejudices
  },
  {
    id: 6,
    question:
      "Which tool is associated with Generative AI in the presentation?",
    options: ["ChatGPT", "Google Maps", "Excel", "Photoshop"],
    correctAnswer: 0, // ChatGPT
  },
  {
    id: 7,
    question:
      "What is the primary purpose of digital marketing campaigns, as emphasized in the presentation?",
    options: [
      "To replace all traditional advertising methods",
      "To increase engagement and conversion rates through targeted strategies",
      "To reduce the need for customer interaction",
      "To focus solely on viral content creation",
    ],
    correctAnswer: 1, // Increase engagement/conversions via targeting
  },
  {
    id: 8,
    question:
      "Which principle is NOT listed as a core foundation of digital marketing in the presentation?",
    options: [
      "Customer-centricity",
      "Data-driven decision-making",
      "Multi-channel integration",
      "Exclusive reliance on print media",
    ],
    correctAnswer: 3, // Exclusive print media reliance
  },
  {
    id: 9,
    question:
      "Which tool is explicitly mentioned as essential for digital marketers in the presentation?",
    options: ["Canva", "Photoshop", "AutoCAD", "QuickBooks"],
    correctAnswer: 0, // Canva
  },
  {
    id: 10,
    question:
      "What key behavior does the presentation advise marketers to adopt for long-term success?",
    options: [
      "Strictly follow outdated trends",
      "Avoid analytics platforms",
      "Stay adaptable and keep learning",
      "Limit campaigns to one social platform",
    ],
    correctAnswer: 2, // Stay adaptable and keep learning
  },
];

export default function TriviaPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(
    new Array(triviaQuestions.length).fill(-1)
  );
  const [timeLeft, setTimeLeft] = useState(60); // 2 minutes in seconds
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const addScore = useMutation(api.score.addScore);

  useEffect(() => {
    const userEmail = localStorage.getItem("triviaUserEmail");
    if (!userEmail) {
      router.push("/");
      return;
    }
  }, [router]);

  useEffect(() => {
    if (!isTimerActive || gameCompleted) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          setIsTimerActive(false);
          setGameCompleted(true);
          handleAutoSubmit();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isTimerActive, gameCompleted]);

  const handleAutoSubmit = useCallback(() => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const results = {
      answers: selectedAnswers,
      questions: triviaQuestions,
      timeExpired: true,
      completedAt: new Date().toISOString(),
    };

    const correctAnswers = results.answers.filter(
      (answer, index) => answer === results.questions[index].correctAnswer
    ).length;

    if (localStorage.getItem("hasCompletedTrivia")) {
      toast.info("You have already completed the trivia.");
    } else {
      addScore({
        name: localStorage.getItem("triviaUserEmail") ?? "",
        score: correctAnswers,
        answered: selectedAnswers.filter((answer) => answer !== -1).length,
        gender: localStorage.getItem("triviaUserGender") ?? "",
      });

      toast.info("Time's up! Your answers have been submitted.");

      localStorage.setItem("triviaResults", JSON.stringify(results));
      localStorage.setItem("hasCompletedTrivia", "true");
    }

    router.push("/results");
  }, [selectedAnswers, router, isSubmitting]);

  const handleAnswerSelect = (answerIndex: number) => {
    if (gameCompleted) return;
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < triviaQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setIsTimerActive(false);
    setGameCompleted(true);

    const results = {
      answers: selectedAnswers,
      questions: triviaQuestions,
      timeExpired: false,
      completedAt: new Date().toISOString(),
      timeRemaining: timeLeft,
    };

    const correctAnswers = results.answers.filter(
      (answer, index) => answer === results.questions[index].correctAnswer
    ).length;

    if (localStorage.getItem("hasCompletedTrivia")) {
      toast.info("You have already completed the trivia.");
    } else {
      addScore({
        name: localStorage.getItem("triviaUserEmail") ?? "",
        score: correctAnswers,
        answered: selectedAnswers.filter((answer) => answer !== -1).length,
        gender: localStorage.getItem("triviaUserGender") ?? "",
      });

      toast.info("Time's up! Your answers have been submitted.");

      localStorage.setItem("triviaResults", JSON.stringify(results));
      localStorage.setItem("hasCompletedTrivia", "true");
    }
    router.push("/results");
  };

  const handleGoBack = () => {
    if (
      confirm("Are you sure you want to leave? Your progress will be lost.")
    ) {
      localStorage.removeItem("triviaUserEmail");
      router.push("/");
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const answeredQuestions = selectedAnswers.filter(
    (answer) => answer !== -1
  ).length;
  const progressPercentage = (answeredQuestions / triviaQuestions.length) * 100;
  const isTimeWarning = timeLeft <= 30 && timeLeft > 10;
  const isTimeCritical = timeLeft <= 10;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Navigation Header with Back Button */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-heading font-bold text-2xl text-primary">
            BeginnerBytes Quiz
          </h1>
          <div className="w-24"></div> {/* Spacer for centering */}
        </div>

        {/* Timer and Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div
              className={`flex items-center gap-2 ${
                isTimeCritical
                  ? "text-red-600"
                  : isTimeWarning
                  ? "text-orange-500"
                  : "text-primary"
              }`}
            >
              <Clock
                className={`h-6 w-6 ${isTimeCritical ? "animate-pulse" : ""}`}
              />
              <span className="font-heading font-bold text-2xl">
                {formatTime(timeLeft)}
              </span>
              {isTimeWarning && (
                <AlertTriangle className="h-5 w-5 text-orange-500" />
              )}
            </div>
            <div className="text-right">
              <p className="font-body text-sm text-muted-foreground">
                Question {currentQuestion + 1} of {triviaQuestions.length}
              </p>
              <p className="font-body text-sm text-muted-foreground">
                {answeredQuestions} answered
              </p>
            </div>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          {isTimeWarning && (
            <div className="mt-2 p-2 bg-orange-100 border border-orange-300 rounded-lg">
              <p className="text-orange-700 text-sm font-body text-center">
                {isTimeCritical
                  ? "⚠️ Time almost up! Submit now!"
                  : "⏰ Less than 30 seconds remaining"}
              </p>
            </div>
          )}
        </div>

        {/* Question Card */}
        <Card className="mb-8 border-primary/20 shadow-lg">
          <CardContent className="p-8">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full font-heading font-semibold text-sm">
                  Question {currentQuestion + 1}
                </span>
                {selectedAnswers[currentQuestion] !== -1 && (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
              </div>
              <h2 className="font-heading font-bold text-2xl text-foreground leading-relaxed">
                {triviaQuestions[currentQuestion].question}
              </h2>
            </div>

            {/* Answer Options */}
            <div className="grid gap-3">
              {triviaQuestions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={gameCompleted}
                  className={`p-4 text-left rounded-lg border-2 transition-all duration-200 font-body text-base ${
                    selectedAnswers[currentQuestion] === index
                      ? "border-primary bg-primary/10 text-primary font-semibold"
                      : gameCompleted
                      ? "border-border bg-muted/30 text-muted-foreground cursor-not-allowed"
                      : "border-border hover:border-primary/50 hover:bg-muted/50 text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedAnswers[currentQuestion] === index
                          ? "border-primary bg-primary"
                          : "border-muted-foreground"
                      }`}
                    >
                      {selectedAnswers[currentQuestion] === index && (
                        <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                      )}
                    </div>
                    <span>{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center">
          <Button
            onClick={handlePrevious}
            disabled={currentQuestion === 0 || gameCompleted || isSubmitting}
            variant="outline"
            className="font-heading font-semibold bg-transparent"
          >
            Previous
          </Button>

          <div className="flex gap-3">
            {currentQuestion === triviaQuestions.length - 1 ? (
              <Button
                onClick={handleSubmit}
                disabled={
                  answeredQuestions < triviaQuestions.length ||
                  gameCompleted ||
                  isSubmitting
                }
                className="bg-green-600 hover:bg-green-700 text-white font-heading font-semibold px-8"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Submitting...
                  </div>
                ) : (
                  "Submit Quiz"
                )}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={
                  selectedAnswers[currentQuestion] === -1 ||
                  gameCompleted ||
                  isSubmitting
                }
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-heading font-semibold"
              >
                Next Question
              </Button>
            )}
          </div>
        </div>

        {/* Question Overview */}
        <Card className="mt-8 border-border/50">
          <CardContent className="p-6">
            <h3 className="font-heading font-semibold text-lg mb-4">
              Question Overview
            </h3>
            <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
              {triviaQuestions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestion(index)}
                  disabled={gameCompleted}
                  className={`w-10 h-10 rounded-lg border-2 font-heading font-semibold text-sm transition-colors ${
                    index === currentQuestion
                      ? "border-primary bg-primary text-primary-foreground"
                      : selectedAnswers[index] !== -1
                      ? "border-green-500 bg-green-100 text-green-700"
                      : gameCompleted
                      ? "border-border bg-muted/30 text-muted-foreground cursor-not-allowed"
                      : "border-border bg-background text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
