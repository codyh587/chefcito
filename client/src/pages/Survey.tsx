import { useState } from "react";

import { ChevronRight, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import {
  type FoodPreferences,
  useFoodPreferences,
} from "@/contexts/FoodPreferencesContext";

type Question = {
  id: keyof FoodPreferences;
  question: string;
  emoji: string;
  options: { value: any; label: string; emoji: string }[];
};

const questions: Question[] = [
  {
    id: "spiceLevel",
    question: "¿Cuál es tu nivel de fuego?",
    emoji: "🔥",
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
    emoji: "🍽️",
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
    emoji: "🍗",
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
    emoji: "🌎",
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
    emoji: "🎂",
    options: [
      { value: "sweet", label: "Dulce Destructor", emoji: "🍰" },
      { value: "savory", label: "Salado Supremo", emoji: "🧀" },
      { value: "both", label: "Maestro de Todo", emoji: "👑" },
    ],
  },
  {
    id: "surveyFinished",
    question: "¡Listo para la batalla culinaria!",
    emoji: "✨",
    options: [{ value: true, label: "Let's go!", emoji: "👊" }],
  },
];

export function Survey() {
  const { updatePreferences } = useFoodPreferences();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [answers, setAnswers] = useState<Partial<FoodPreferences>>({});

  const question = questions[currentQuestion];
  const progress = (currentQuestion / (questions.length - 1)) * 100;

  function handleSelect(value: string) {
    setSelectedOption(value);

    setTimeout(() => {
      const newAnswers = { ...answers, [question.id]: value };
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedOption("");
        setAnswers(newAnswers);
      } else {
        updatePreferences({ ...newAnswers, surveyFinished: true });
      }
    }, 500);
  }

  return (
    <div className="bg-chefcito relative h-full min-h-screen w-full p-10">
      <AnimatePresence>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-y-5 overflow-x-hidden overflow-y-auto text-center"
        >
          {/* logo */}
          <motion.img
            animate={{ rotate: [10, -10, 10] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="m-auto h-20 w-20 rounded-full shadow-lg"
            src="/logo.svg"
            draggable={false}
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
          <div className="h-3.5 overflow-hidden rounded-full border-2 border-white bg-white/30">
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
              className="rounded-3xl border-4 border-yellow-300 bg-white p-5"
            >
              {/* question header */}
              <div className="text-5xl">{question.emoji}</div>
              <div className="mt-2.5 mb-6 text-xl font-bold text-gray-800">
                {question.question}
              </div>
              <div className="flex flex-col gap-y-3">
                {/* question options */}
                {question.options.map((option) => (
                  <motion.button
                    key={option.value}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSelect(option.value)}
                    className={`relative flex min-h-15 items-center gap-3 overflow-hidden rounded-2xl border-4 p-4 text-left text-base font-bold transition-all duration-300 ${
                      selectedOption === option.value
                        ? "border-green-500 bg-green-100 text-green-800"
                        : "border-gray-300 bg-linear-to-r from-yellow-50 to-red-50 text-gray-800 active:border-yellow-300"
                    }`}
                  >
                    <div className="shrink-0 text-3xl">{option.emoji}</div>
                    <div className="flex-1 text-lg">{option.label}</div>
                    {selectedOption === option.value && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1, rotate: 360 }}
                        transition={{ type: "spring", stiffness: 100 }}
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
      </AnimatePresence>
    </div>
  );
}
