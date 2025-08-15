"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Trophy,
  Clock,
  CheckCircle,
  XCircle,
  RotateCcw,
  Home,
  AlertTriangle,
} from "lucide-react";

interface TriviaResults {
  answers: number[];
  questions: Array<{
    id: number;
    question: string;
    options: string[];
    correctAnswer: number;
  }>;
  timeExpired: boolean;
  completedAt: string;
  timeRemaining?: number;
}

export default function ResultsPage() {
  const [results, setResults] = useState<TriviaResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const savedResults = localStorage.getItem("triviaResults");
    if (savedResults) {
      setResults(JSON.parse(savedResults));
    } else {
      // Redirect to homepage if no results found
      router.push("/");
    }
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="font-body text-muted-foreground">
            Loading your results...
          </p>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
            <h2 className="font-heading font-bold text-xl mb-2">
              No Results Found
            </h2>
            <p className="font-body text-muted-foreground mb-4">
              We couldn't find your quiz results. Please take the quiz first.
            </p>
            <Button
              onClick={() => router.push("/")}
              className="bg-primary hover:bg-primary/90"
            >
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const correctAnswers = results.answers.filter(
    (answer, index) => answer === results.questions[index].correctAnswer
  ).length;
  const totalQuestions = results.questions.length;
  const scorePercentage = Math.round((correctAnswers / totalQuestions) * 100);
  const answeredQuestions = results.answers.filter(
    (answer) => answer !== -1
  ).length;

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadgeColor = (percentage: number) => {
    if (percentage >= 80) return "bg-green-100 text-green-800 border-green-200";
    if (percentage >= 60)
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-red-100 text-red-800 border-red-200";
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handlePlayAgain = async () => {
    setIsNavigating(true);
    try {
      localStorage.removeItem("triviaResults");
      await router.push("/trivia");
    } catch (error) {
      console.error("Navigation error:", error);
      setIsNavigating(false);
    }
  };

  const handleGoHome = async () => {
    setIsNavigating(true);
    try {
      localStorage.removeItem("triviaResults");
      localStorage.removeItem("triviaUserEmail");
      await router.push("/");
    } catch (error) {
      console.error("Navigation error:", error);
      setIsNavigating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-4">
          <h1 className="font-heading font-bold text-2xl text-primary">
            QuizMaster
          </h1>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className={`h-12 w-12 ${getScoreColor(scorePercentage)}`} />
            <h1 className="font-heading font-black text-4xl text-primary">
              Quiz Complete!
            </h1>
          </div>
          {results.timeExpired ? (
            <p className="font-body text-lg text-orange-600">
              Time expired, but great effort!
            </p>
          ) : (
            <p className="font-body text-lg text-green-600">
              Congratulations on completing the quiz!
            </p>
          )}
        </div>

        {/* Score Summary */}
        <Card className="mb-8 border-primary/20 shadow-lg">
          <CardHeader className="text-center pb-4">
            <CardTitle className="font-heading text-2xl">
              Your Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div
                className={`text-6xl font-heading font-black mb-2 ${getScoreColor(
                  scorePercentage
                )}`}
              >
                {scorePercentage}%
              </div>
              <Badge
                className={`text-lg px-4 py-2 ${getScoreBadgeColor(
                  scorePercentage
                )}`}
              >
                {correctAnswers} out of {totalQuestions} correct
              </Badge>
            </div>

            <Progress value={scorePercentage} className="h-3" />

            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="font-heading font-semibold">Correct</span>
                </div>
                <div className="text-2xl font-heading font-bold text-green-600">
                  {correctAnswers}
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <XCircle className="h-5 w-5 text-red-500" />
                  <span className="font-heading font-semibold">Incorrect</span>
                </div>
                <div className="text-2xl font-heading font-bold text-red-600">
                  {answeredQuestions - correctAnswers}
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <Clock className="h-5 w-5 text-blue-500" />
                  <span className="font-heading font-semibold">Time</span>
                </div>
                <div className="text-2xl font-heading font-bold text-blue-600">
                  {results.timeExpired
                    ? "Expired"
                    : formatTime(120 - (results.timeRemaining || 0))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Question Review */}
        {/*  <Card className="mb-8">
          <CardHeader>
            <CardTitle className="font-heading text-xl">
              Question Review
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {results.questions.map((question, index) => {
              const userAnswer = results.answers[index];
              const isCorrect = userAnswer === question.correctAnswer;
              const wasAnswered = userAnswer !== -1;

              return (
                <div
                  key={question.id}
                  className={`p-4 rounded-lg border-2 ${
                    !wasAnswered
                      ? "border-gray-300 bg-gray-50"
                      : isCorrect
                      ? "border-green-200 bg-green-50"
                      : "border-red-200 bg-red-50"
                  }`}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="flex-shrink-0">
                      {!wasAnswered ? (
                        <div className="w-6 h-6 rounded-full bg-gray-400 flex items-center justify-center">
                          <span className="text-white text-sm font-bold">
                            ?
                          </span>
                        </div>
                      ) : isCorrect ? (
                        <CheckCircle className="h-6 w-6 text-green-500" />
                      ) : (
                        <XCircle className="h-6 w-6 text-red-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-heading font-semibold text-lg mb-2">
                        Question {index + 1}: {question.question}
                      </h3>
                      <div className="space-y-2">
                        {question.options.map((option, optionIndex) => (
                          <div
                            key={optionIndex}
                            className={`p-2 rounded border ${
                              optionIndex === question.correctAnswer
                                ? "bg-green-100 border-green-300 text-green-800"
                                : optionIndex === userAnswer && !isCorrect
                                ? "bg-red-100 border-red-300 text-red-800"
                                : "bg-white border-gray-200"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-4 h-4 rounded-full border-2 ${
                                  optionIndex === question.correctAnswer
                                    ? "bg-green-500 border-green-500"
                                    : optionIndex === userAnswer && !isCorrect
                                    ? "bg-red-500 border-red-500"
                                    : "border-gray-300"
                                }`}
                              />
                              <span className="font-body">{option}</span>
                              {optionIndex === question.correctAnswer && (
                                <Badge
                                  variant="outline"
                                  className="text-xs bg-green-100 text-green-700"
                                >
                                  Correct
                                </Badge>
                              )}
                              {optionIndex === userAnswer && !isCorrect && (
                                <Badge
                                  variant="outline"
                                  className="text-xs bg-red-100 text-red-700"
                                >
                                  Your Answer
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      {!wasAnswered && (
                        <p className="text-gray-600 text-sm mt-2 font-body">
                          No answer provided
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card> */}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handlePlayAgain}
            disabled={isNavigating}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-heading font-semibold px-8 py-3"
          >
            {isNavigating ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></div>
                Loading...
              </div>
            ) : (
              <>
                <RotateCcw className="h-5 w-5 mr-2" />
                Play Again
              </>
            )}
          </Button>
          <Button
            onClick={handleGoHome}
            disabled={isNavigating}
            variant="outline"
            className="font-heading font-semibold px-8 py-3 bg-transparent"
          >
            {isNavigating ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                Loading...
              </div>
            ) : (
              <>
                <Home className="h-5 w-5 mr-2" />
                Back to Home
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
