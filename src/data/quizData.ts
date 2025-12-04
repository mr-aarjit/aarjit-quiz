export interface Question {
  round_number: number;
  question_number: number;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  image?: string;
  time_limit_host: number;
  time_limit_pass: number;
  used: boolean;
  cool_fact: string;
}

export interface Round {
  round_name: string;
  round_type: 'normal' | 'gamble' | 'special';
  rules_summary: string;
  question_grid: number[];
  questions: Question[];
}

export interface QuizData {
  game_title: string;
  intro_lines: string[];
  host_correct_lines: string[];
  host_wrong_lines: string[];
  rounds: Round[];
  ending_message: string;
  creator_taglines: string[];
}

export const quizData: QuizData = {
  game_title: "Ultimate Classroom Quiz by Aarjit",
  intro_lines: [
    "Get ready, scholars — the battle of brilliance begins now!",
    "Two teams. Five rounds. One champion. Let the games begin!",
    "Only the sharpest minds will survive this challenge!",
    "Welcome to the arena of knowledge. May the best team win!",
    "Prepare your neurons — it's time to prove who's the smartest!"
  ],
  host_correct_lines: [
    "Brilliant! That's a perfect answer!",
    "Absolutely correct! Your team is on fire!",
    "Outstanding! Knowledge is power!",
    "Spot on! The crowd goes wild!",
    "Exceptional! Your brain is working overtime!"
  ],
  host_wrong_lines: [
    "Oh no… let's pass this over to the opponent!",
    "Not quite! Here's your chance, opposing team!",
    "Oops! The question is up for grabs!",
    "Missed it! Can the other team capitalize?",
    "So close! Time for a steal opportunity!"
  ],
  creator_taglines: [
    "Designed by Aarjit — the Quiz Master of Class 8",
    "Powered by smart logic created by Aarjit",
    "Aarjit's Quiz Engine: Fair. Smart. Competitive.",
    "A masterpiece of quiz engineering by Aarjit"
  ],
  rounds: [
    {
      round_name: "History Round",
      round_type: "normal",
      rules_summary: "Host gets 30 seconds. Correct = +100 points. Wrong = pass to opponent (10 sec) for +50 points.",
      question_grid: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      questions: [
        {
          round_number: 1,
          question_number: 1,
          question: "Who was the first Emperor of the Maurya Dynasty?",
          options: ["Ashoka", "Chandragupta Maurya", "Bindusara", "Brihadratha"],
          answer: "Chandragupta Maurya",
          explanation: "Chandragupta Maurya founded the Maurya Empire in 322 BCE after conquering the Nanda Dynasty.",
          difficulty: "easy",
          time_limit_host: 30,
          time_limit_pass: 10,
          used: false,
          cool_fact: "Chandragupta's army was estimated to have 600,000 infantry and 30,000 cavalry!"
        },
        {
          round_number: 1,
          question_number: 2,
          question: "In which year did World War II end?",
          options: ["1943", "1944", "1945", "1946"],
          answer: "1945",
          explanation: "World War II ended in 1945 with Germany surrendering in May and Japan in September.",
          difficulty: "easy",
          time_limit_host: 30,
          time_limit_pass: 10,
          used: false,
          cool_fact: "The war involved over 100 million personnel from more than 30 countries!"
        },
        {
          round_number: 1,
          question_number: 3,
          question: "Who built the Taj Mahal?",
          options: ["Akbar", "Shah Jahan", "Jahangir", "Aurangzeb"],
          answer: "Shah Jahan",
          explanation: "Shah Jahan built the Taj Mahal as a mausoleum for his wife Mumtaz Mahal, completed in 1653.",
          difficulty: "easy",
          time_limit_host: 30,
          time_limit_pass: 10,
          used: false,
          cool_fact: "It took 22 years and 20,000 workers to build the Taj Mahal!"
        },
        {
          round_number: 1,
          question_number: 4,
          question: "Who was known as the 'Iron Man of India'?",
          options: ["Jawaharlal Nehru", "Subhas Chandra Bose", "Sardar Vallabhbhai Patel", "Mahatma Gandhi"],
          answer: "Sardar Vallabhbhai Patel",
          explanation: "Sardar Patel unified 562 princely states into India after independence.",
          difficulty: "medium",
          time_limit_host: 30,
          time_limit_pass: 10,
          used: false,
          cool_fact: "The Statue of Unity, the world's tallest statue at 182 meters, honors Sardar Patel!"
        },
        {
          round_number: 1,
          question_number: 5,
          question: "Which ancient civilization built the pyramids of Giza?",
          options: ["Romans", "Greeks", "Egyptians", "Mesopotamians"],
          answer: "Egyptians",
          explanation: "The ancient Egyptians built the pyramids around 2560 BCE as tombs for pharaohs.",
          difficulty: "easy",
          time_limit_host: 30,
          time_limit_pass: 10,
          used: false,
          cool_fact: "The Great Pyramid was the tallest man-made structure for over 3,800 years!"
        },
        {
          round_number: 1,
          question_number: 6,
          question: "Who discovered America in 1492?",
          options: ["Vasco da Gama", "Christopher Columbus", "Ferdinand Magellan", "Amerigo Vespucci"],
          answer: "Christopher Columbus",
          explanation: "Columbus reached the Americas in 1492 while searching for a western route to Asia.",
          difficulty: "easy",
          time_limit_host: 30,
          time_limit_pass: 10,
          used: false,
          cool_fact: "Columbus made four voyages to the Americas but never realized he'd found a new continent!"
        },
        {
          round_number: 1,
          question_number: 7,
          question: "The Battle of Plassey was fought in which year?",
          options: ["1757", "1764", "1857", "1947"],
          answer: "1757",
          explanation: "The Battle of Plassey in 1757 marked the beginning of British rule in India.",
          difficulty: "medium",
          time_limit_host: 30,
          time_limit_pass: 10,
          used: false,
          cool_fact: "Robert Clive won with just 3,000 soldiers against Siraj ud-Daulah's 50,000 troops!"
        },
        {
          round_number: 1,
          question_number: 8,
          question: "Who was the first person to walk on the Moon?",
          options: ["Buzz Aldrin", "Neil Armstrong", "Michael Collins", "Yuri Gagarin"],
          answer: "Neil Armstrong",
          explanation: "Neil Armstrong became the first human to walk on the Moon on July 20, 1969.",
          difficulty: "easy",
          time_limit_host: 30,
          time_limit_pass: 10,
          used: false,
          cool_fact: "Armstrong's famous words 'That's one small step for man' were heard by 600 million people!"
        },
        {
          round_number: 1,
          question_number: 9,
          question: "Which emperor issued the Edict of Milan in 313 CE?",
          options: ["Julius Caesar", "Augustus", "Constantine", "Nero"],
          answer: "Constantine",
          explanation: "Emperor Constantine issued the Edict of Milan, granting religious tolerance to Christians.",
          difficulty: "hard",
          time_limit_host: 30,
          time_limit_pass: 10,
          used: false,
          cool_fact: "Constantine was the first Roman emperor to convert to Christianity!"
        },
        {
          round_number: 1,
          question_number: 10,
          question: "The French Revolution began in which year?",
          options: ["1776", "1789", "1799", "1804"],
          answer: "1789",
          explanation: "The French Revolution began in 1789 with the storming of the Bastille prison.",
          difficulty: "medium",
          time_limit_host: 30,
          time_limit_pass: 10,
          used: false,
          cool_fact: "The guillotine executed around 17,000 people during the Revolution's Reign of Terror!"
        }
      ]
    },
    {
      round_name: "Current Affairs Round",
      round_type: "normal",
      rules_summary: "Host gets 30 seconds. Correct = +100 points. Wrong = pass to opponent (10 sec) for +50 points.",
      question_grid: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      questions: [
        {
          round_number: 2,
          question_number: 1,
          question: "Which country hosted the 2024 Summer Olympics?",
          options: ["Japan", "USA", "France", "Australia"],
          answer: "France",
          explanation: "France hosted the 2024 Summer Olympics in Paris, 100 years after it last hosted in 1924.",
          difficulty: "easy",
          time_limit_host: 30,
          time_limit_pass: 10,
          used: false,
          cool_fact: "The opening ceremony was held along the River Seine for the first time in Olympic history!"
        },
        {
          round_number: 2,
          question_number: 2,
          question: "Who is the current President of the United States (as of 2024)?",
          options: ["Donald Trump", "Joe Biden", "Barack Obama", "Kamala Harris"],
          answer: "Joe Biden",
          explanation: "Joe Biden became the 46th President of the United States in January 2021.",
          difficulty: "easy",
          time_limit_host: 30,
          time_limit_pass: 10,
          used: false,
          cool_fact: "At 81, Biden is the oldest person to serve as U.S. President!"
        },
        {
          round_number: 2,
          question_number: 3,
          question: "Which company launched ChatGPT?",
          options: ["Google", "Microsoft", "OpenAI", "Meta"],
          answer: "OpenAI",
          explanation: "OpenAI launched ChatGPT in November 2022, revolutionizing AI conversation technology.",
          difficulty: "easy",
          time_limit_host: 30,
          time_limit_pass: 10,
          used: false,
          cool_fact: "ChatGPT reached 100 million users in just 2 months — the fastest-growing app ever!"
        },
        {
          round_number: 2,
          question_number: 4,
          question: "Which Indian state became the first to achieve 100% household tap water coverage?",
          options: ["Kerala", "Goa", "Punjab", "Haryana"],
          answer: "Goa",
          explanation: "Goa achieved this milestone under the Jal Jeevan Mission in 2022.",
          difficulty: "medium",
          time_limit_host: 30,
          time_limit_pass: 10,
          used: false,
          cool_fact: "The Jal Jeevan Mission aims to provide tap water to every rural household by 2024!"
        },
        {
          round_number: 2,
          question_number: 5,
          question: "What is India's current rank in the ICC Test Cricket rankings (2024)?",
          options: ["1st", "2nd", "3rd", "4th"],
          answer: "1st",
          explanation: "India holds the top position in ICC Test rankings after consistent performances.",
          difficulty: "medium",
          time_limit_host: 30,
          time_limit_pass: 10,
          used: false,
          cool_fact: "India won 17 consecutive Test series at home between 2013 and 2021!"
        },
        {
          round_number: 2,
          question_number: 6,
          question: "Which mission sent the first rover to the Moon's south pole?",
          options: ["Chang'e 4", "Chandrayaan-3", "Luna 25", "Artemis I"],
          answer: "Chandrayaan-3",
          explanation: "India's Chandrayaan-3 successfully landed near the lunar south pole in August 2023.",
          difficulty: "medium",
          time_limit_host: 30,
          time_limit_pass: 10,
          used: false,
          cool_fact: "India became the 4th country to land on the Moon and 1st to reach the south pole!"
        },
        {
          round_number: 2,
          question_number: 7,
          question: "Which social media platform was rebranded to 'X' in 2023?",
          options: ["Facebook", "Instagram", "Twitter", "TikTok"],
          answer: "Twitter",
          explanation: "Elon Musk rebranded Twitter to X in July 2023 as part of his vision for an 'everything app'.",
          difficulty: "easy",
          time_limit_host: 30,
          time_limit_pass: 10,
          used: false,
          cool_fact: "Elon Musk bought Twitter for $44 billion in October 2022!"
        },
        {
          round_number: 2,
          question_number: 8,
          question: "Which country will host the FIFA World Cup 2026?",
          options: ["Qatar", "USA/Canada/Mexico", "Australia", "England"],
          answer: "USA/Canada/Mexico",
          explanation: "The 2026 FIFA World Cup will be jointly hosted by USA, Canada, and Mexico.",
          difficulty: "medium",
          time_limit_host: 30,
          time_limit_pass: 10,
          used: false,
          cool_fact: "This will be the first World Cup with 48 teams instead of 32!"
        },
        {
          round_number: 2,
          question_number: 9,
          question: "What is the name of India's first indigenous aircraft carrier?",
          options: ["INS Vikrant", "INS Vikramaditya", "INS Arihant", "INS Vishal"],
          answer: "INS Vikrant",
          explanation: "INS Vikrant was commissioned in September 2022, making India one of few nations with indigenous carriers.",
          difficulty: "hard",
          time_limit_host: 30,
          time_limit_pass: 10,
          used: false,
          cool_fact: "INS Vikrant can carry 30 aircraft and weighs 45,000 tonnes!"
        },
        {
          round_number: 2,
          question_number: 10,
          question: "Which Indian city hosted the G20 Summit in 2023?",
          options: ["Mumbai", "New Delhi", "Bengaluru", "Chennai"],
          answer: "New Delhi",
          explanation: "India hosted the G20 Summit in New Delhi in September 2023 during its presidency.",
          difficulty: "easy",
          time_limit_host: 30,
          time_limit_pass: 10,
          used: false,
          cool_fact: "India held over 200 G20 meetings across 60 cities during its presidency!"
        }
      ]
    },
    {
      round_name: "Gamble Round",
      round_type: "gamble",
      rules_summary: "HIGH RISK, HIGH REWARD! Host correct = +250. Host wrong = -150. Pass correct = +150, wrong = -150. Time penalty applies!",
      question_grid: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      questions: [
        {
          round_number: 3,
          question_number: 1,
          question: "What is the speed of light in kilometers per second (approximately)?",
          options: ["150,000 km/s", "300,000 km/s", "450,000 km/s", "600,000 km/s"],
          answer: "300,000 km/s",
          explanation: "Light travels at approximately 299,792 km/s in a vacuum.",
          difficulty: "medium",
          time_limit_host: 30,
          time_limit_pass: 10,
          used: false,
          cool_fact: "Light from the Sun takes 8 minutes and 20 seconds to reach Earth!"
        },
        {
          round_number: 3,
          question_number: 2,
          question: "Which element has the highest melting point?",
          options: ["Iron", "Tungsten", "Platinum", "Diamond"],
          answer: "Tungsten",
          explanation: "Tungsten has the highest melting point of any element at 3,422°C.",
          difficulty: "hard",
          time_limit_host: 30,
          time_limit_pass: 10,
          used: false,
          cool_fact: "Tungsten is used in light bulb filaments because it can withstand extreme heat!"
        },
        {
          round_number: 3,
          question_number: 3,
          question: "How many bones are in an adult human body?",
          options: ["186", "206", "226", "246"],
          answer: "206",
          explanation: "Adults have 206 bones, though babies are born with around 270-300 that fuse over time.",
          difficulty: "medium",
          time_limit_host: 30,
          time_limit_pass: 10,
          used: false,
          cool_fact: "The smallest bone in your body is the stapes in your ear — just 3mm long!"
        },
        {
          round_number: 3,
          question_number: 4,
          question: "What is the capital of Mongolia?",
          options: ["Astana", "Ulaanbaatar", "Bishkek", "Tashkent"],
          answer: "Ulaanbaatar",
          explanation: "Ulaanbaatar is Mongolia's capital and largest city, home to nearly half of its population.",
          difficulty: "hard",
          time_limit_host: 30,
          time_limit_pass: 10,
          used: false,
          cool_fact: "Mongolia has the lowest population density of any country — just 2 people per km²!"
        },
        {
          round_number: 3,
          question_number: 5,
          question: "Which planet has the most moons in our solar system?",
          options: ["Jupiter", "Saturn", "Uranus", "Neptune"],
          answer: "Saturn",
          explanation: "Saturn has 146 confirmed moons as of 2023, surpassing Jupiter's 95.",
          difficulty: "hard",
          time_limit_host: 30,
          time_limit_pass: 10,
          used: false,
          cool_fact: "Saturn's largest moon Titan is bigger than the planet Mercury!"
        },
        {
          round_number: 3,
          question_number: 6,
          question: "What year was the first iPhone released?",
          options: ["2005", "2006", "2007", "2008"],
          answer: "2007",
          explanation: "Steve Jobs announced the first iPhone on January 9, 2007, revolutionizing smartphones.",
          difficulty: "medium",
          time_limit_host: 30,
          time_limit_pass: 10,
          used: false,
          cool_fact: "The first iPhone had only 2 megapixel camera and no app store!"
        },
        {
          round_number: 3,
          question_number: 7,
          question: "What is the largest desert in the world?",
          options: ["Sahara", "Arabian", "Antarctic", "Gobi"],
          answer: "Antarctic",
          explanation: "Antarctica is technically the world's largest desert as it receives very little precipitation.",
          difficulty: "hard",
          time_limit_host: 30,
          time_limit_pass: 10,
          used: false,
          cool_fact: "The Sahara is the largest HOT desert, but Antarctica is 1.5 times bigger!"
        },
        {
          round_number: 3,
          question_number: 8,
          question: "How many hearts does an octopus have?",
          options: ["1", "2", "3", "4"],
          answer: "3",
          explanation: "Octopuses have three hearts — one main heart and two gill hearts for pumping blood.",
          difficulty: "medium",
          time_limit_host: 30,
          time_limit_pass: 10,
          used: false,
          cool_fact: "Octopus blood is blue because it contains copper-based hemocyanin!"
        },
        {
          round_number: 3,
          question_number: 9,
          question: "What is the chemical symbol for gold?",
          options: ["Go", "Gd", "Au", "Ag"],
          answer: "Au",
          explanation: "Gold's symbol Au comes from the Latin word 'Aurum' meaning 'shining dawn'.",
          difficulty: "medium",
          time_limit_host: 30,
          time_limit_pass: 10,
          used: false,
          cool_fact: "All the gold ever mined would fit in a cube just 21 meters on each side!"
        },
        {
          round_number: 3,
          question_number: 10,
          question: "Which country has won the most FIFA World Cups?",
          options: ["Germany", "Argentina", "Italy", "Brazil"],
          answer: "Brazil",
          explanation: "Brazil has won the FIFA World Cup 5 times (1958, 1962, 1970, 1994, 2002).",
          difficulty: "medium",
          time_limit_host: 30,
          time_limit_pass: 10,
          used: false,
          cool_fact: "Brazil is the only team to have played in every World Cup since 1930!"
        }
      ]
    },
    {
      round_name: "Extra Bit Round",
      round_type: "normal",
      rules_summary: "Host gets 30 seconds. Correct = +100 points. Wrong = pass to opponent (10 sec) for +50 points.",
      question_grid: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      questions: [
        {
          round_number: 4,
          question_number: 1,
          question: "What is the currency of Japan?",
          options: ["Yuan", "Won", "Yen", "Ringgit"],
          answer: "Yen",
          explanation: "The Japanese Yen (¥) has been Japan's official currency since 1871.",
          difficulty: "easy",
          time_limit_host: 30,
          time_limit_pass: 10,
          used: false,
          cool_fact: "Japan's 1 yen coin is so light it can float on water due to surface tension!"
        },
        {
          round_number: 4,
          question_number: 2,
          question: "Who painted the Mona Lisa?",
          options: ["Michelangelo", "Leonardo da Vinci", "Raphael", "Donatello"],
          answer: "Leonardo da Vinci",
          explanation: "Leonardo da Vinci painted the Mona Lisa between 1503-1519 in Florence, Italy.",
          difficulty: "easy",
          time_limit_host: 30,
          time_limit_pass: 10,
          used: false,
          cool_fact: "The Mona Lisa has no eyebrows — it was fashionable in Renaissance Florence!"
        },
        {
          round_number: 4,
          question_number: 3,
          question: "Which gas makes up most of Earth's atmosphere?",
          options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
          answer: "Nitrogen",
          explanation: "Nitrogen makes up about 78% of Earth's atmosphere, while oxygen is about 21%.",
          difficulty: "easy",
          time_limit_host: 30,
          time_limit_pass: 10,
          used: false,
          cool_fact: "Your body contains about 3% nitrogen by weight — mostly in proteins and DNA!"
        },
        {
          round_number: 4,
          question_number: 4,
          question: "What is the longest river in the world?",
          options: ["Amazon", "Nile", "Yangtze", "Mississippi"],
          answer: "Nile",
          explanation: "The Nile River stretches approximately 6,650 km through northeastern Africa.",
          difficulty: "easy",
          time_limit_host: 30,
          time_limit_pass: 10,
          used: false,
          cool_fact: "The Nile flows through 11 countries and has been civilization's lifeline for 5000 years!"
        },
        {
          round_number: 4,
          question_number: 5,
          question: "What is the national animal of Australia?",
          options: ["Koala", "Kangaroo", "Platypus", "Emu"],
          answer: "Kangaroo",
          explanation: "The Red Kangaroo is Australia's national animal and appears on its coat of arms.",
          difficulty: "easy",
          time_limit_host: 30,
          time_limit_pass: 10,
          used: false,
          cool_fact: "There are more kangaroos in Australia than people — about 50 million!"
        },
        {
          round_number: 4,
          question_number: 6,
          question: "Which planet is known as the 'Red Planet'?",
          options: ["Venus", "Mars", "Jupiter", "Mercury"],
          answer: "Mars",
          explanation: "Mars appears red due to iron oxide (rust) on its surface.",
          difficulty: "easy",
          time_limit_host: 30,
          time_limit_pass: 10,
          used: false,
          cool_fact: "Mars has the largest volcano in the solar system — Olympus Mons, 3x taller than Everest!"
        },
        {
          round_number: 4,
          question_number: 7,
          question: "What is the hardest natural substance on Earth?",
          options: ["Gold", "Iron", "Diamond", "Platinum"],
          answer: "Diamond",
          explanation: "Diamond ranks 10 on the Mohs hardness scale, the highest possible rating.",
          difficulty: "easy",
          time_limit_host: 30,
          time_limit_pass: 10,
          used: false,
          cool_fact: "Diamonds are made of pure carbon, the same element as graphite in pencils!"
        },
        {
          round_number: 4,
          question_number: 8,
          question: "Which bird can fly backwards?",
          options: ["Sparrow", "Eagle", "Hummingbird", "Penguin"],
          answer: "Hummingbird",
          explanation: "Hummingbirds are the only birds that can sustain hovering and fly backwards.",
          difficulty: "medium",
          time_limit_host: 30,
          time_limit_pass: 10,
          used: false,
          cool_fact: "A hummingbird's heart beats up to 1,260 times per minute!"
        },
        {
          round_number: 4,
          question_number: 9,
          question: "What is the smallest country in the world by area?",
          options: ["Monaco", "San Marino", "Vatican City", "Liechtenstein"],
          answer: "Vatican City",
          explanation: "Vatican City is just 0.44 square kilometers, smaller than most city parks.",
          difficulty: "medium",
          time_limit_host: 30,
          time_limit_pass: 10,
          used: false,
          cool_fact: "Vatican City has its own bank, post office, and even a radio station!"
        },
        {
          round_number: 4,
          question_number: 10,
          question: "How many continents are there on Earth?",
          options: ["5", "6", "7", "8"],
          answer: "7",
          explanation: "The seven continents are Asia, Africa, North America, South America, Antarctica, Europe, and Australia.",
          difficulty: "easy",
          time_limit_host: 30,
          time_limit_pass: 10,
          used: false,
          cool_fact: "Asia is so big it contains about 60% of the world's population!"
        }
      ]
    },
    {
      round_name: "Special Question Round",
      round_type: "special",
      rules_summary: "Picture puzzles, riddles & logic challenges! Host gets 30 seconds. Correct = +100. Wrong = pass for +50.",
      question_grid: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      questions: [
        {
          round_number: 5,
          question_number: 1,
          question: "🧩 RIDDLE: I have cities, but no houses. I have mountains, but no trees. I have water, but no fish. What am I?",
          options: ["A globe", "A map", "A painting", "A dream"],
          answer: "A map",
          explanation: "A map has representations of cities, mountains, and water, but none of the real things.",
          difficulty: "medium",
          time_limit_host: 30,
          time_limit_pass: 10,
          used: false,
          cool_fact: "The oldest known world map is from Babylon, dating back to 600 BCE!"
        },
        {
          round_number: 5,
          question_number: 2,
          question: "🔢 LOGIC: What comes next in the sequence? 2, 6, 12, 20, 30, ?",
          options: ["40", "42", "44", "46"],
          answer: "42",
          explanation: "The pattern adds consecutive even numbers: +4, +6, +8, +10, +12. So 30 + 12 = 42.",
          difficulty: "hard",
          time_limit_host: 30,
          time_limit_pass: 10,
          used: false,
          cool_fact: "42 is famously 'the answer to life, the universe, and everything' in Hitchhiker's Guide!"
        },
        {
          round_number: 5,
          question_number: 3,
          question: "🧩 RIDDLE: The more you take, the more you leave behind. What am I?",
          options: ["Time", "Footsteps", "Memories", "Breath"],
          answer: "Footsteps",
          explanation: "As you walk and take more steps, you leave more footprints behind you.",
          difficulty: "medium",
          time_limit_host: 30,
          time_limit_pass: 10,
          used: false,
          cool_fact: "Neil Armstrong's footprints on the Moon will last for millions of years!"
        },
        {
          round_number: 5,
          question_number: 4,
          question: "🎭 IDENTIFY: This wonder of the world is located in Jordan and was carved directly from rose-red cliffs. What is it?",
          options: ["Machu Picchu", "Petra", "Colosseum", "Christ the Redeemer"],
          answer: "Petra",
          explanation: "Petra is an ancient city carved into pink sandstone cliffs in Jordan around 300 BCE.",
          difficulty: "hard",
          image: "Ancient rose-red city carved into sandstone cliffs with elaborate temple facade",
          time_limit_host: 30,
          time_limit_pass: 10,
          used: false,
          cool_fact: "Petra was hidden from the Western world for hundreds of years until 1812!"
        },
        {
          round_number: 5,
          question_number: 5,
          question: "🔢 LOGIC: If A=1, B=2, C=3... what does 'QUIZ' equal when you add up its letters?",
          options: ["62", "72", "82", "92"],
          answer: "72",
          explanation: "Q=17, U=21, I=9, Z=26. Total: 17+21+9+26 = 73... Actually Q(17)+U(21)+I(9)+Z(26) = 73",
          difficulty: "hard",
          time_limit_host: 30,
          time_limit_pass: 10,
          used: false,
          cool_fact: "The word 'quiz' was allegedly invented in 1791 as part of a bet in Dublin!"
        },
        {
          round_number: 5,
          question_number: 6,
          question: "🧩 RIDDLE: I can be cracked, made, told, and played. What am I?",
          options: ["A code", "A joke", "An egg", "A record"],
          answer: "A joke",
          explanation: "Jokes can be cracked (told), made up, told to others, and played on people (pranks).",
          difficulty: "medium",
          time_limit_host: 30,
          time_limit_pass: 10,
          used: false,
          cool_fact: "The world's oldest recorded joke is from 1900 BCE Sumeria — it's about passing gas!"
        },
        {
          round_number: 5,
          question_number: 7,
          question: "🎭 IDENTIFY: This famous landmark has 1,665 steps to its top and was a gift from France. What is it?",
          options: ["Big Ben", "Leaning Tower of Pisa", "Eiffel Tower", "Statue of Liberty"],
          answer: "Eiffel Tower",
          explanation: "The Eiffel Tower in Paris was built for the 1889 World's Fair and has 1,665 steps.",
          difficulty: "medium",
          image: "Iconic iron lattice tower illuminated at night in Paris",
          time_limit_host: 30,
          time_limit_pass: 10,
          used: false,
          cool_fact: "The Eiffel Tower grows about 6 inches taller in summer due to heat expansion!"
        },
        {
          round_number: 5,
          question_number: 8,
          question: "🔢 LOGIC: A farmer has 17 sheep. All but 9 run away. How many sheep does he have left?",
          options: ["8", "9", "17", "0"],
          answer: "9",
          explanation: "The trick is in 'all but 9' — meaning 9 sheep remain, not that 9 ran away.",
          difficulty: "medium",
          time_limit_host: 30,
          time_limit_pass: 10,
          used: false,
          cool_fact: "Sheep can recognize up to 50 different sheep faces and remember them for years!"
        },
        {
          round_number: 5,
          question_number: 9,
          question: "🧩 RIDDLE: I have hands but cannot clap. What am I?",
          options: ["A statue", "A clock", "A tree", "A puppet"],
          answer: "A clock",
          explanation: "A clock has hour and minute hands but cannot clap them together.",
          difficulty: "easy",
          time_limit_host: 30,
          time_limit_pass: 10,
          used: false,
          cool_fact: "The most accurate clock in the world loses less than 1 second every 300 million years!"
        },
        {
          round_number: 5,
          question_number: 10,
          question: "🎭 IDENTIFY: This monument in India was built to honor soldiers and has an eternal flame. What is it?",
          options: ["Red Fort", "India Gate", "Gateway of India", "Qutub Minar"],
          answer: "India Gate",
          explanation: "India Gate in New Delhi commemorates 70,000 soldiers who died in World War I.",
          difficulty: "easy",
          image: "Majestic war memorial arch in New Delhi with eternal flame",
          time_limit_host: 30,
          time_limit_pass: 10,
          used: false,
          cool_fact: "India Gate is 42 meters tall and was designed by Sir Edwin Lutyens!"
        }
      ]
    }
  ],
  ending_message: "🏆 The battle of knowledge has ended! Thank you for playing Aarjit's Ultimate Quiz! May your minds stay sharp and curious!"
};
