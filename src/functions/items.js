import options from "../assets/options";
import shuffle from "./shuffle";

export const newWords = () => shuffle(options).slice(0, 25);
