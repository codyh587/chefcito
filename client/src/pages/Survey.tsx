import { useState } from "react";

import {
  Cake,
  ChefHat,
  ChevronRight,
  Drumstick,
  Flame,
  Globe,
  Sparkles,
  Utensils,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import type { FoodPreferences } from "../types/FoodPreferences.tsx";

type Question = {
  id?: keyof FoodPreferences;
  question: string;
  icon: React.ReactNode;
  options: { value: string; label: string; emoji: string }[];
};

const questions: Question[] = [
  {
    id: "spiceLevel",
    question: "¿Cuál es tu nivel de FUEGO? 🔥",
    icon: <Flame className="h-8 w-8" />,
    options: [
      { value: "mild", label: "El Suave", emoji: "😌" },
      { value: "medium", label: "El Valiente", emoji: "😤" },
      { value: "hot", label: "El Luchador", emoji: "🔥" },
      { value: "extreme", label: "EL CAMPEÓN!", emoji: "💀" },
    ],
  },
  {
    id: "mealType",
    question: "¿Cuándo entras al ring de sabor?",
    icon: <Utensils className="h-8 w-8" />,
    options: [
      { value: "breakfast", label: "Batalla del Amanecer", emoji: "🌅" },
      { value: "lunch", label: "Combate del Mediodía", emoji: "☀️" },
      { value: "dinner", label: "Lucha Nocturna", emoji: "🌙" },
      { value: "snacks", label: "Golpes Rápidos", emoji: "⚡" },
    ],
  },
  {
    id: "protein",
    question: "¿Cuál es tu compañero de batalla?",
    icon: <Drumstick className="h-8 w-8" />,
    options: [
      { value: "chicken", label: "Pollo Power", emoji: "🐔" },
      { value: "beef", label: "Toro Fuerte", emoji: "🥩" },
      { value: "pork", label: "Puerco Punch", emoji: "🐷" },
      { value: "seafood", label: "Ola Marina", emoji: "🦐" },
      { value: "vegetarian", label: "Fuerza Verde", emoji: "🥬" },
    ],
  },
  {
    id: "cuisine",
    question: "¿En qué arena peleas?",
    icon: <Globe className="h-8 w-8" />,
    options: [
      { value: "mexican", label: "La Arena Mexicana", emoji: "🌮" },
      { value: "italian", label: "El Coliseo Italiano", emoji: "🍝" },
      { value: "asian", label: "Templo del Este", emoji: "🍜" },
      { value: "american", label: "Ring Americano", emoji: "🍔" },
      { value: "fusion", label: "Lucha Libre Mix", emoji: "🌍" },
    ],
  },
  {
    id: "sweetOrSavory",
    question: "¿Dulce o Salado, luchador?",
    icon: <Cake className="h-8 w-8" />,
    options: [
      { value: "sweet", label: "Dulce Destructor", emoji: "🍰" },
      { value: "savory", label: "Salado Supremo", emoji: "🧀" },
      { value: "both", label: "Maestro de Todo", emoji: "👑" },
    ],
  },
  {
    id: "cuisine",
    question: "¡Listo para la batalla culinaria!",
    icon: <Sparkles className="h-8 w-8" />,
    options: [],
  },
];

type Props = {
  onComplete?: (preferences: FoodPreferences) => void;
};

export function Survey({ onComplete }: Props) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Partial<FoodPreferences>>({});
  const [selectedOption, setSelectedOption] = useState<string>("");

  const question = questions[currentQuestion];
  const progress = (currentQuestion / (questions.length - 1)) * 100;

  const handleSelect = (value: string) => {
    setSelectedOption(value);

    setTimeout(() => {
      const newAnswers = { ...answers, [question.id!]: value };
      setAnswers(newAnswers);

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedOption("");
      } else {
        onComplete ?? (newAnswers as FoodPreferences);
      }
    }, 500);
  };

  return (
    <div className="h-full min-h-screen bg-linear-to-br from-red-600 via-yellow-400 to-green-600 px-10 py-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-stretch gap-y-5 overflow-x-hidden overflow-y-auto text-center"
      >
        {/* logo */}
        <motion.div
          animate={{ rotate: [10, -10, 10] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="m-auto h-20 w-20 rounded-full border-4 border-white bg-linear-to-br from-yellow-300 via-orange-500 to-pink-500 to-85% text-white shadow-lg"
        >
          <ChefHat className="mx-auto mt-2.5 h-12 w-12" />
        </motion.div>

        {/* header */}
        <motion.h1
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-3xl font-black text-white"
          style={{ textShadow: "3px 3px 0 rgba(0,0,0,0.3)" }}
        >
          ¡BIENVENIDO A CHEFCITO!
        </motion.h1>

        {/* progress bar */}
        <div className="h-3.5 overflow-hidden rounded-full border-2 border-white bg-white/30">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
            className="h-full bg-linear-to-r from-green-400 via-yellow-400 to-red-500"
          />
        </div>

        {/* question card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className="rounded-3xl border-4 border-yellow-300 bg-white p-5"
          >
            <div className="mb-5 flex flex-col items-center justify-center gap-3 text-red-500">
              {question.icon}
              <h2 className="text-center text-xl leading-tight font-black text-gray-900">
                {question.question}
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {question.options.map((option) => (
                <motion.button
                  key={option.value}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSelect(option.value)}
                  className={`relative flex min-h-15 items-center gap-3 overflow-hidden rounded-2xl border-4 p-4 text-left text-base font-bold transition-all duration-300 ${
                    selectedOption === option.value
                      ? "border-green-500 bg-green-100 text-green-800"
                      : "border-gray-300 bg-linear-to-r from-yellow-50 to-red-50 text-gray-800 active:border-yellow-500"
                  } `}
                >
                  <span className="shrink-0 text-3xl">{option.emoji}</span>
                  <span className="flex-1">{option.label}</span>
                  {selectedOption === option.value && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1, rotate: 360 }}
                      transition={{ type: "spring", stiffness: 200 }}
                    >
                      <Sparkles className="h-6 w-6 text-green-600" />
                    </motion.div>
                  )}
                  <ChevronRight className="h-5 w-5 shrink-0 opacity-50" />
                </motion.button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
