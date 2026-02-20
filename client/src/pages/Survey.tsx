import { useState } from "react";

import { ChevronRight, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import {
  type FoodPreferences,
  useFoodPreferences,
} from "@/contexts/FoodPreferencesContext";

type Option = {
  value: any;
  label: string;
  emoji: string;
  multiSelectSubmit?: boolean;
};

type Question = {
  id: keyof FoodPreferences;
  question: string;
  emoji: string;
  options: Option[];
  multiSelect?: boolean;
};

const questions: Question[] = [
  {
    id: "allergens",
    question: "Do you have any allergies?",
    emoji: "⚠️",
    options: [
      { value: "milk", label: "Dairy", emoji: "🥛" },
      { value: "eggs", label: "Eggs", emoji: "🥚" },
      { value: "nuts", label: "Nuts", emoji: "🥜" },
      { value: "soy", label: "Soy", emoji: "🫘" },
      { value: "gluten", label: "Gluten", emoji: "🌾" },
      {
        value: "submit",
        label: "Done",
        emoji: "✅",
        multiSelectSubmit: true,
      },
    ],
    multiSelect: true,
  },
  {
    id: "spice",
    question: "How much heat can you handle?",
    emoji: "🌶️",
    options: [
      { value: 0, label: "None", emoji: "😁" },
      { value: 0.25, label: "Mild", emoji: "😌" },
      { value: 0.5, label: "Medium", emoji: "😤" },
      { value: 0.75, label: "Hot", emoji: "🔥" },
      { value: 1, label: "Extreme", emoji: "💀" },
    ],
  },
  {
    id: "proteinFilled",
    question: "How important is protein to you?",
    emoji: "💪",
    options: [
      { value: true, label: "High protein, please", emoji: "🥩" },
      { value: false, label: "Not a priority", emoji: "🥗" },
    ],
  },
  {
    id: "maxCookTime",
    question: "How much time do you have to cook?",
    emoji: "⏱️",
    options: [
      { value: 15, label: "15 minutes", emoji: "⚡" },
      { value: 30, label: "30 minutes", emoji: "🕐" },
      { value: 60, label: "1 hour", emoji: "🍳" },
      { value: 120, label: "2+ hours", emoji: "👨‍🍳" },
    ],
  },
  {
    id: "maxNumIngredients",
    question: "How many ingredients are you okay working with?",
    emoji: "🛒",
    options: [
      { value: 5, label: "5 or fewer", emoji: "✌️" },
      { value: 10, label: "Up to 10", emoji: "👌" },
      { value: 20, label: "Up to 20", emoji: "🧑‍🍳" },
      { value: 100, label: "No limit", emoji: "🌟" },
    ],
  },
  {
    id: "loose",
    question: "How strict should we be about using only what you have on hand?",
    emoji: "🧺",
    options: [
      { value: false, label: "Strict — only my ingredients", emoji: "🔒" },
      { value: true, label: "Flexible — extras are fine", emoji: "🔓" },
    ],
  },
  {
    id: "pastry",
    question: "Are you in the mood for something sweet?",
    emoji: "🍰",
    options: [
      { value: true, label: "Yes, show me desserts!", emoji: "🧁" },
      { value: false, label: "No, keep it savory", emoji: "🧀" },
    ],
  },
  {
    id: "surveyFinished",
    question: "You're all set!",
    emoji: "✨",
    options: [{ value: true, label: "Let's go!", emoji: "👊" }],
  },
];

export function Survey() {
  const { updatePreferences } = useFoodPreferences();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const question = questions[currentQuestion];
  const progress = (currentQuestion / (questions.length - 1)) * 100;

  function handleSelect(option: Option) {
    if (question.multiSelect && selectedOptions.includes(option.value)) {
      setSelectedOptions((prev) => prev.filter((opt) => opt !== option.value));
      return;
    }

    const selectionsToSave =
      question.multiSelect && option.multiSelectSubmit
        ? selectedOptions
        : option.value;

    setSelectedOptions((prev) => [...prev, option.value]);

    if (question.multiSelect && !option.multiSelectSubmit) {
      return;
    }

    setTimeout(() => {
      updatePreferences({ [question.id]: selectionsToSave });
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedOptions([]);
      }
    }, 500);
  }

  return (
    <div className="bg-chefcito relative min-h-screen p-10">
      <AnimatePresence>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="-mr-10 flex flex-col gap-y-5 pr-10 text-center"
        >
          {/* logo */}
          <motion.img
            animate={{ rotate: [10, -10, 10] }}
            transition={{ duration: 4, repeat: Infinity }}
            src="/logo.svg"
            draggable={false}
            className="m-auto h-20 rounded-full shadow-lg"
          />
          {/* header */}
          <motion.div
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="text-3xl font-black text-white"
            style={{ textShadow: "3px 3px 0 rgba(0,0,0,0.3)" }}
          >
            ¡BIENVENIDO A CHEFCITO!
          </motion.div>
          {/* progress bar */}
          <div className="mb-1 h-3.5 overflow-hidden rounded-full border-2 border-white bg-white/30">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
              className="h-full bg-linear-to-r from-yellow-400 via-orange-500 to-pink-500"
            />
          </div>
          {/* question card */}
          <AnimatePresence mode="popLayout">
            <motion.div
              key={currentQuestion}
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
              className="bg-background rounded-3xl border-4 border-yellow-300 p-5"
            >
              {/* question header */}
              <div className="text-5xl">{question.emoji}</div>
              <div className="mt-2.5 mb-6 text-xl font-bold">
                {question.question}
              </div>
              {/* question options */}
              <div className="flex flex-col gap-y-3">
                {question.options.map((option) => (
                  <motion.button
                    key={option.value}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSelect(option)}
                    className={`flex items-center gap-x-3 rounded-2xl border-4 p-4 text-left font-bold transition-all duration-300 ${
                      selectedOptions.includes(option.value)
                        ? "border-green-500 bg-green-100 text-green-800"
                        : "border-gray-300 bg-linear-to-r from-yellow-50 to-red-50 text-gray-800 active:border-yellow-300"
                    }`}
                  >
                    <div className="text-3xl">{option.emoji}</div>
                    <div className="text-lg">{option.label}</div>
                    {selectedOptions.includes(option.value) ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1, rotate: 360 }}
                        transition={{ type: "spring", stiffness: 100 }}
                        className="ml-auto"
                      >
                        <Sparkles className="h-6 text-green-600" />
                      </motion.div>
                    ) : (
                      <ChevronRight className="ml-auto h-5 opacity-50" />
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
