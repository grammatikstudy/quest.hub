import { DeckUnit, Trophy, ShopItem } from '../types';

export const INITIAL_INVITE_CODES = [
  'q7vtr82klmn3-54ptywzxc9', 'm4kjp91zxcv6-83qazwrtm2', 'b9wqe23hytr7-15plkjfvd4', 
  'z2asd76poiuyt-98mnbvfrt1', 'x5zxc14lkjhgf-37qazwsxc6', 'v8poiuy82qazws-24mnbvfrt5', 
  'n1lkjh93mnbv6-69qazwsxc8', 'm6mnbv45qazwsx-71poiuytr2', 'k3qaz78poiuyt-42lkjhgfd9', 
  'j9wsx12lkjhgf-85qazwsxc3', 'h4edc56qazwsx-19poiuytr4', 'f7rfv90poiuyt-63lkjhgfd5', 
  'd2tgb34lkjhgf-91qazwsxc7', 's8yhn67qazwsx-28poiuytr6', 'a1ujm89poiuyt-52lkjhgfd8', 
  'q6ikm21lkjhgf-74qazwsxc1', 'w3opl54qazwsx-39poiuytr2', 'e9qaz76poiuyt-81lkjhgfd3', 
  'r4wsx83lkjhgf-16qazwsxc5', 't7edc19qazwsx-47poiuytr6', 'y2rfv42poiuyt-95lkjhgfd7', 
  'u5tgb65lkjhgf-23qazwsxc8', 'i8yhn98qazwsx-64poiuytr9', 'o1ujm37poiuyt-31lkjhgfd1', 
  'p6ikm54lkjhgf-82qazwsxc2', 'z3opl21qazwsx-17poiuytr3', 'x9qaz68poiuyt-59lkjhgfd4', 
  'v4wsx75lkjhgf-72qazwsxc6', 'n8edc39qazwsx-48poiuytr7', 'm1rfv24poiuyt-13lkjhgfd8', 'k7tgb81lkjhgf-96qazwsxc9'
];

export const GERMAN_UNITS: DeckUnit[] = [
  {
    id: 'ger-kulturzone',
    badge: 'Kulturzone',
    title: 'Finde deine AG!',
    lang1: 'en-GB',
    lang2: 'de-DE',
    items: [
      { prompt: "What do we do?", de: ["Was machen wir?"] },
      { prompt: "We make music.", de: ["Wir machen Musik."] },
      { prompt: "We do yoga.", de: ["Wir machen Yoga."] },
      { prompt: "We sing songs.", de: ["Wir singen Lieder."] },
      { prompt: "We play handball.", de: ["Wir spielen Handball."] },
      { prompt: "We watch films.", de: ["Wir sehen Filme."] },
      { prompt: "We build robots.", de: ["Wir bauen Roboter."] },
      { prompt: "after-school club", de: ["die Arbeitsgemeinschaft (AG)", "die AG", "Arbeitsgemeinschaft"] },
      { prompt: "class", de: ["die Klasse"] },
      { prompt: "club", de: ["der Klub"] },
      { prompt: "school", de: ["die Schule"] },
      { prompt: "male students", de: ["die Schüler"] },
      { prompt: "female students", de: ["die Schülerinnen"] },
      { prompt: "Which after-school clubs do you have at your school?", de: ["Welche AGs hast du in deiner Schule?"] },
      { prompt: "We have...", de: ["Wir haben..."] },
      { prompt: "a choir club", de: ["eine Chor-AG"] },
      { prompt: "a film club", de: ["eine Film-AG"] },
      { prompt: "a handball club", de: ["eine Handball-AG"] },
      { prompt: "an orchestra club", de: ["eine Orchester-AG"] },
      { prompt: "a technology club", de: ["eine Technik-AG"] },
      { prompt: "a yoga club", de: ["eine Yoga-AG"] },
      { prompt: "sometimes", de: ["manchmal"] },
      { prompt: "often", de: ["oft"] },
      { prompt: "in the mornings", de: ["morgens"] },
      { prompt: "in the afternoons", de: ["nachmittags"] },
      { prompt: "in the evenings", de: ["abends"] }
    ]
  },
  {
    id: 'ger-unit-1',
    badge: 'Unit 1',
    title: 'Das ist meine Schule!',
    lang1: 'en-GB',
    lang2: 'de-DE',
    items: [
      { prompt: "That is...", de: ["Das ist..."] },
      { prompt: "the library", de: ["die Bibliothek"] },
      { prompt: "the computer room", de: ["der Computerraum"] },
      { prompt: "the canteen", de: ["die Kantine"] },
      { prompt: "the classroom", de: ["das Klassenzimmer"] },
      { prompt: "the lab", de: ["das Labor"] },
      { prompt: "the staffroom", de: ["das Lehrerzimmer"] },
      { prompt: "the playground", de: ["der Schulhof"] },
      { prompt: "the sports hall", de: ["die Sporthalle"] },
      { prompt: "Do you like your school?", de: ["Magst du deine Schule?"] },
      { prompt: "What is ... like?", de: ["Wie ist...?"] },
      { prompt: "I like my school because...", de: ["Ich mag meine Schule, denn..."] },
      { prompt: "I don't like my school because...", de: ["Ich mag meine Schule nicht, denn..."] },
      { prompt: "it is good", de: ["sie ist gut"] },
      { prompt: "the library is quiet", de: ["die Bibliothek ist ruhig"] },
      { prompt: "the classes are big", de: ["die Klassen sind groß"] },
      { prompt: "the classrooms are modern", de: ["die Klassenzimmer sind modern"] },
      { prompt: "the labs are old", de: ["die Labors sind alt"] },
      { prompt: "the students are friendly", de: ["die Schüler sind freundlich", "die Schülerinnen sind freundlich", "die Schüler / die Schülerinnen sind freundlich"] },
      { prompt: "the teachers are funny", de: ["die Lehrer sind lustig"] }
    ]
  },
  {
    id: 'ger-unit-2',
    badge: 'Unit 2',
    title: 'Zeit für Pause!',
    lang1: 'en-GB',
    lang2: 'de-DE',
    items: [
      { prompt: "What do you do at breaktime?", de: ["Was machst du in der Pause?"] },
      { prompt: "At breaktime...", de: ["In der Pause..."] },
      { prompt: "I drink...", de: ["trinke ich..."] },
      { prompt: "cola", de: ["Cola"] },
      { prompt: "juice", de: ["Saft"] },
      { prompt: "water", de: ["Wasser"] },
      { prompt: "I eat...", de: ["esse ich..."] },
      { prompt: "a roll", de: ["ein Brötchen"] },
      { prompt: "chocolate", de: ["Schokolade"] },
      { prompt: "I play football", de: ["spiele ich Fußball"] },
      { prompt: "I do sport", de: ["mache ich Sport"] },
      { prompt: "I do my homework", de: ["mache ich meine Hausaufgaben"] },
      { prompt: "I talk to friends", de: ["rede ich mit Freunden"] },
      { prompt: "My male friend...", de: ["Mein Freund..."] },
      { prompt: "My female friend...", de: ["Meine Freundin..."] },
      { prompt: "drinks cola", de: ["trinkt Cola"] },
      { prompt: "eats an orange", de: ["isst eine Orange"] },
      { prompt: "plays football", de: ["spielt Fußball"] },
      { prompt: "does sport", de: ["macht Sport"] },
      { prompt: "does homework", de: ["macht Hausaufgaben"] },
      { prompt: "talks to friends", de: ["redet mit Freunden"] }
    ]
  },
  {
    id: 'ger-unit-3',
    badge: 'Unit 3',
    title: 'Was lernst du?',
    lang1: 'en-GB',
    lang2: 'de-DE',
    items: [
      { prompt: "What is your favourite subject?", de: ["Was ist dein Lieblingsfach?"] },
      { prompt: "My favourite subject is...", de: ["Mein Lieblingsfach ist..."] },
      { prompt: "My favourite subjects are...", de: ["Meine Lieblingsfächer sind..."] },
      { prompt: "German", de: ["Deutsch"] },
      { prompt: "English", de: ["Englisch"] },
      { prompt: "geography", de: ["Erdkunde"] },
      { prompt: "French", de: ["Französisch"] },
      { prompt: "history", de: ["Geschichte"] },
      { prompt: "computing", de: ["Informatik"] },
      { prompt: "art", de: ["Kunst"] },
      { prompt: "maths", de: ["Mathe"] },
      { prompt: "music", de: ["Musik"] },
      { prompt: "science", de: ["Naturwissenschaften"] },
      { prompt: "RE", de: ["Religion"] },
      { prompt: "Spanish", de: ["Spanisch"] },
      { prompt: "PE", de: ["Sport"] },
      { prompt: "DT technology", de: ["Technik"] },
      { prompt: "drama", de: ["Theater"] },
      { prompt: "favourite day", de: ["der Lieblingstag"] },
      { prompt: "Monday on Mondays", de: ["Montag, montags", "Montag", "montags"] },
      { prompt: "Tuesday on Tuesdays", de: ["Dienstag, dienstags", "Dienstag", "dienstags"] },
      { prompt: "Wednesday on Wednesdays", de: ["Mittwoch, mittwochs", "Mittwoch", "mittwochs"] },
      { prompt: "Thursday on Thursdays", de: ["Donnerstag, donnerstags", "Donnerstag", "donnerstags"] },
      { prompt: "Friday on Fridays", de: ["Freitag, freitags", "Freitag", "freitags"] },
      { prompt: "Saturday on Saturdays", de: ["Samstag, samstags", "Samstag", "samstags"] },
      { prompt: "Sunday on Sundays", de: ["Sonntag, sonntags", "Sonntag", "sonntags"] },
      { prompt: "On Mondays I have history", de: ["Montags habe ich Geschichte."] },
      { prompt: "I learn nothing on Saturdays", de: ["Samstags lerne ich nichts."] }
    ]
  },
  {
    id: 'ger-unit-4',
    badge: 'Unit 4',
    title: 'Magst du Deutsch?',
    lang1: 'en-GB',
    lang2: 'de-DE',
    items: [
      { prompt: "Do you like maths?", de: ["Magst du Mathe?"] },
      { prompt: "Yes I really like maths", de: ["Ja, ich mag Mathe sehr."] },
      { prompt: "Yes I love maths", de: ["Ja, ich liebe Mathe."] },
      { prompt: "No I don't like maths at all", de: ["Nein, ich mag Mathe gar nicht."] },
      { prompt: "I like maths because it is...", de: ["Ich mag Mathe, weil es... ist."] },
      { prompt: "I don't like maths because it is...", de: ["Ich mag Mathe nicht, weil es... ist."] },
      { prompt: "I like science because it is...", de: ["Ich mag Naturwissenschaften, weil sie... sind."] },
      { prompt: "I don't like science because it is...", de: ["Ich mag Naturwissenschaften nicht, weil sie... sind."] },
      { prompt: "cool", de: ["cool"] },
      { prompt: "easy", de: ["einfach"] },
      { prompt: "interesting", de: ["interessant"] },
      { prompt: "complicated", de: ["kompliziert"] },
      { prompt: "creative", de: ["kreativ"] },
      { prompt: "boring", de: ["langweilig"] },
      { prompt: "funny", de: ["lustig"] },
      { prompt: "difficult", de: ["schwierig"] },
      { prompt: "important", de: ["wichtig"] }
    ]
  },
  {
    id: 'ger-unit-5',
    badge: 'Unit 5',
    title: 'Outfit des Tages: Schuluniform!',
    lang1: 'en-GB',
    lang2: 'de-DE',
    items: [
      { prompt: "What do you wear at school?", de: ["Was trägst du in der Schule?"] },
      { prompt: "I wear...", de: ["Ich trage..."] },
      { prompt: "He wears...", de: ["Er trägt..."] },
      { prompt: "She wears...", de: ["Sie trägt..."] },
      { prompt: "We wear...", de: ["Wir tragen..."] },
      { prompt: "a shirt", de: ["ein Hemd"] },
      { prompt: "trousers", de: ["eine Hose"] },
      { prompt: "a jacket", de: ["eine Jacke"] },
      { prompt: "a dress", de: ["ein Kleid"] },
      { prompt: "a tie", de: ["eine Krawatte"] },
      { prompt: "a skirt", de: ["einen Rock"] },
      { prompt: "a t-shirt", de: ["ein T-Shirt"] },
      { prompt: "shoes", de: ["Schuhe"] },
      { prompt: "a uniform", de: ["eine Uniform"] },
      { prompt: "The jacket is grey", de: ["Die Jacke ist grau."] },
      { prompt: "The shoes are black", de: ["Die Schuhe sind schwarz."] },
      { prompt: "I find my clothes...", de: ["Ich finde meine Kleidung..."] },
      { prompt: "comfortable", de: ["bequem"] },
      { prompt: "fine delicate", de: ["fein"] },
      { prompt: "modern", de: ["modern"] },
      { prompt: "beautiful lovely", de: ["schön"] },
      { prompt: "great", de: ["toll"] }
    ]
  },
  {
    id: 'ger-unit-6',
    badge: 'Unit 6',
    title: 'Regeln, Regeln, Regeln!',
    lang1: 'en-GB',
    lang2: 'de-DE',
    items: [
      { prompt: "What are you allowed to do at school?", de: ["Was darfst du in der Schule machen?"] },
      { prompt: "You are allowed to...", de: ["Man darf..."] },
      { prompt: "play football at breaktime", de: ["in der Pause Fußball spielen"] },
      { prompt: "run in the playground", de: ["auf dem Schulhof laufen"] },
      { prompt: "play on your phone", de: ["auf dem Handy spielen"] },
      { prompt: "You are not allowed to in the classroom...", de: ["Man darf im Klassenzimmer nicht..."] },
      { prompt: "eat", de: ["essen"] },
      { prompt: "talk", de: ["reden"] },
      { prompt: "You must...", de: ["Man muss..."] },
      { prompt: "do a lot of homework", de: ["viele Hausaufgaben machen"] },
      { prompt: "be hard-working", de: ["fleißig sein"] },
      { prompt: "be quiet", de: ["ruhig sein"] },
      { prompt: "At my dream school you are allowed to...", de: ["In meiner Traumschule darf man..."] },
      { prompt: "At my dream school you must...", de: ["In meiner Traumschule muss man..."] },
      { prompt: "I find that...", de: ["Das finde ich..."] },
      { prompt: "In my opinion that is...", de: ["Meiner Meinung nach ist das..."] },
      { prompt: "In my opinion this rule is...", de: ["Meiner Meinung nach ist diese Regel..."] },
      { prompt: "relaxing", de: ["entspannend"] },
      { prompt: "fair", de: ["fair"] },
      { prompt: "unfair", de: ["unfair"] },
      { prompt: "good", de: ["gut"] },
      { prompt: "OK", de: ["okay"] },
      { prompt: "right", de: ["richtig"] }
    ]
  }
];

export const LATIN_UNITS: DeckUnit[] = [
  {
    id: 'lat-stage-1',
    badge: 'Stage 1',
    title: 'Cambridge Latin Book 1 • Stage 1',
    lang1: 'la',
    lang2: 'en-GB',
    items: [
      { prompt: "canis", de: ["dog"] },
      { prompt: "coquus", de: ["cook"] },
      { prompt: "est", de: ["he is", "she is", "it is", "is"] },
      { prompt: "filius", de: ["son"] },
      { prompt: "hortus", de: ["garden"] },
      { prompt: "in", de: ["in", "on"] },
      { prompt: "laborat", de: ["he works", "she works", "it works", "is working", "works"] },
      { prompt: "mater", de: ["mother"] },
      { prompt: "pater", de: ["father"] },
      { prompt: "sedet", de: ["he sits", "she sits", "it sits", "is sitting", "sits"] },
      { prompt: "servus", de: ["slave"] },
      { prompt: "via", de: ["street", "road"] }
    ]
  },
  {
    id: 'lat-stage-2',
    badge: 'Stage 2',
    title: 'Cambridge Latin Book 1 • Stage 2',
    lang1: 'la',
    lang2: 'en-GB',
    items: [
      { prompt: "amicus", de: ["friend"] },
      { prompt: "ancilla", de: ["slave-girl", "maid", "slave girl"] },
      { prompt: "cena", de: ["dinner"] },
      { prompt: "cibus", de: ["food"] },
      { prompt: "dominus", de: ["master"] },
      { prompt: "dormit", de: ["he sleeps", "she sleeps", "it sleeps", "is sleeping", "sleeps"] },
      { prompt: "intrat", de: ["he enters", "she enters", "it enters", "is entering", "enters"] },
      { prompt: "laetus", de: ["happy", "glad"] },
      { prompt: "laudat", de: ["he praises", "she praises", "it praises", "is praising", "praises"] },
      { prompt: "mercator", de: ["merchant", "trader"] },
      { prompt: "quoque", de: ["also", "too"] },
      { prompt: "salutat", de: ["he greets", "she greets", "it greets", "is greeting", "greets"] }
    ]
  },
  {
    id: 'lat-stage-3',
    badge: 'Stage 3',
    title: 'Cambridge Latin Book 1 • Stage 3',
    lang1: 'la',
    lang2: 'en-GB',
    items: [
      { prompt: "bibit", de: ["he drinks", "she drinks", "it drinks", "drinks"] },
      { prompt: "circumspectat", de: ["he looks round", "she looks round", "it looks round", "looks round"] },
      { prompt: "clamat", de: ["he shouts", "she shouts", "it shouts", "shouts"] },
      { prompt: "ecce!", de: ["look!"] },
      { prompt: "exit", de: ["he goes out", "she goes out", "it goes out", "goes out"] },
      { prompt: "exspectat", de: ["he waits for", "she waits for", "it waits for", "waits for"] },
      { prompt: "forum", de: ["market"] },
      { prompt: "ianua", de: ["door"] },
      { prompt: "iratus", de: ["angry"] },
      { prompt: "leo", de: ["lion"] },
      { prompt: "magnus", de: ["big", "great"] },
      { prompt: "navis", de: ["ship"] },
      { prompt: "non", de: ["not"] },
      { prompt: "portat", de: ["he carries", "she carries", "it carries", "carries"] },
      { prompt: "respondet", de: ["he replies", "she replies", "it replies", "replies"] },
      { prompt: "ridet", de: ["he laughs", "she laughs", "it laughs", "smiles", "laughs"] },
      { prompt: "salve!", de: ["hello!"] },
      { prompt: "surgit", de: ["he gets up", "she gets up", "it gets up", "gets up"] },
      { prompt: "taberna", de: ["shop", "inn"] }
    ]
  },
  {
    id: 'lat-stage-4',
    badge: 'Stage 4',
    title: 'Cambridge Latin Book 1 • Stage 4',
    lang1: 'la',
    lang2: 'en-GB',
    items: [
      { prompt: "agit", de: ["he does", "she does", "it does", "does"] },
      { prompt: "anulus", de: ["ring"] },
      { prompt: "coquit", de: ["he cooks", "she cooks", "it cooks", "cooks"] },
      { prompt: "e", de: ["from", "out of"] },
      { prompt: "eheu!", de: ["oh dear! oh no!", "oh dear", "oh no"] },
      { prompt: "habet", de: ["he has", "she has", "it has", "has"] },
      { prompt: "inquit", de: ["he says", "she says", "it says", "says"] },
      { prompt: "judex", de: ["judge"] },
      { prompt: "mendax", de: ["liar"] },
      { prompt: "pecunia", de: ["money"] },
      { prompt: "perterritus", de: ["terrified"] },
      { prompt: "poeta", de: ["poet"] },
      { prompt: "quaerit", de: ["he searches for", "she searches for", "it searches for", "searches for"] },
      { prompt: "quis?", de: ["who?"] },
      { prompt: "reddit", de: ["he gives back", "she gives back", "it gives back", "gives back"] },
      { prompt: "satis", de: ["enough"] },
      { prompt: "sed", de: ["but"] },
      { prompt: "signum", de: ["sign", "seal"] },
      { prompt: "tu", de: ["you"] },
      { prompt: "vocat", de: ["he calls", "she calls", "it calls", "calls"] }
    ]
  },
  {
    id: 'lat-stage-5',
    badge: 'Stage 5',
    title: 'Cambridge Latin Book 1 • Stage 5',
    lang1: 'la',
    lang2: 'en-GB',
    items: [
      { prompt: "adest", de: ["he is here", "she is here", "it is here", "is here"] },
      { prompt: "agricola", de: ["farmer"] },
      { prompt: "ambulat", de: ["he walks", "she walks", "it walks", "walks"] },
      { prompt: "audit", de: ["he hears", "she hears", "it hears", "hears"] },
      { prompt: "clamor", de: ["shout"] },
      { prompt: "contendit", de: ["he hurries", "she hurries", "it hurries", "hurries"] },
      { prompt: "currit", de: ["he runs", "she runs", "it runs", "runs"] },
      { prompt: "fabula", de: ["play", "story"] },
      { prompt: "femina", de: ["woman"] },
      { prompt: "hodie", de: ["today"] },
      { prompt: "iuvenis", de: ["young man"] },
      { prompt: "meus", de: ["my"] },
      { prompt: "multus", de: ["much", "many"] },
      { prompt: "optimus", de: ["best", "very good"] },
      { prompt: "petit", de: ["he heads for", "she heads for", "it heads for", "attacks", "heads for"] },
      { prompt: "plaudit", de: ["he applauds", "she applauds", "it applauds", "applauds"] },
      { prompt: "puella", de: ["girl"] },
      { prompt: "senex", de: ["old man"] },
      { prompt: "spectat", de: ["he watches", "she watches", "it watches", "watches"] },
      { prompt: "stat", de: ["he stands", "she stands", "it stands", "stands"] },
      { prompt: "turba", de: ["crowd"] }
    ]
  },
  {
    id: 'lat-stage-6',
    badge: 'Stage 6',
    title: 'Cambridge Latin Book 1 • Stage 6',
    lang1: 'la',
    lang2: 'en-GB',
    items: [
      { prompt: "abest", de: ["he is absent", "she is absent", "it is absent", "is absent"] },
      { prompt: "cubiculum", de: ["bedroom"] },
      { prompt: "emit", de: ["he buys", "she buys", "it buys", "buys"] },
      { prompt: "ferociter", de: ["fiercely"] },
      { prompt: "festinat", de: ["he hurries", "she hurries", "it hurries", "hurries"] },
      { prompt: "fortis", de: ["brave"] },
      { prompt: "fur", de: ["thief"] },
      { prompt: "intente", de: ["intently"] },
      { prompt: "libertus", de: ["freedman"] },
      { prompt: "olim", de: ["once"] },
      { prompt: "parvus", de: ["small"] },
      { prompt: "per", de: ["through"] },
      { prompt: "postquam", de: ["after"] },
      { prompt: "pulsat", de: ["he hits", "she hits", "it hits", "hits"] },
      { prompt: "quod", de: ["because"] },
      { prompt: "res", de: ["thing"] },
      { prompt: "scribit", de: ["he writes", "she writes", "it writes", "writes"] },
      { prompt: "subito", de: ["suddenly"] },
      { prompt: "superat", de: ["he overcomes", "she overcomes", "it overcomes", "overcomes"] },
      { prompt: "tum", de: ["then"] },
      { prompt: "tuus", de: ["your"] }
    ]
  },
  {
    id: 'lat-stage-7',
    badge: 'Stage 7',
    title: 'Cambridge Latin Book 1 • Stage 7',
    lang1: 'la',
    lang2: 'en-GB',
    items: [
      { prompt: "cénat", de: ["he dines", "she dines", "it dines", "dines"] },
      { prompt: "conspicit", de: ["he catches sight of", "she catches sight of", "it catches sight of", "catches sight of"] },
      { prompt: "cum", de: ["with"] },
      { prompt: "facit", de: ["he makes", "she makes", "it makes", "does", "makes"] },
      { prompt: "heri", de: ["yesterday"] },
      { prompt: "ingens", de: ["huge"] },
      { prompt: "intellegit", de: ["he understands", "she understands", "it understands", "understands"] },
      { prompt: "lacrimat", de: ["he weeps", "she weeps", "it cleans", "weeps"] },
      { prompt: "mortuus", de: ["dead"] },
      { prompt: "narrat", de: ["he tells", "she tells", "it tells", "tells"] },
      { prompt: "necat", de: ["he kills", "she kills", "it kills", "kills"] },
      { prompt: "nihil", de: ["nothing"] },
      { prompt: "omnis", de: ["all"] },
      { prompt: "parat", de: ["he prepares", "she prepares", "it prepares", "prepares"] },
      { prompt: "prope", de: ["near"] },
      { prompt: "rogat", de: ["he asks", "she asks", "it asks", "asks"] },
      { prompt: "tacite", de: ["quietly"] },
      { prompt: "tamen", de: ["however"] },
      { prompt: "terret", de: ["he frightens", "she frightens", "it frightens", "frightens"] },
      { prompt: "valde", de: ["very much"] }
    ]
  },
  {
    id: 'lat-stage-8',
    badge: 'Stage 8',
    title: 'Cambridge Latin Book 1 • Stage 8',
    lang1: 'la',
    lang2: 'en-GB',
    items: [
      { prompt: "agitator", de: ["driver"] },
      { prompt: "agitat", de: ["he chases", "she chases", "it chases", "chases"] },
      { prompt: "consumit", de: ["he consumes", "she consumes", "it consumes", "eats", "consumes"] },
      { prompt: "ducit", de: ["he leads", "she leads", "it leads", "leads"] },
      { prompt: "eum", de: ["him"] },
      { prompt: "facile", de: ["easily"] },
      { prompt: "gladius", de: ["sword"] },
      { prompt: "habitat", de: ["he lives", "she lives", "it lives", "lives"] },
      { prompt: "ignavus", de: ["cowardly"] },
      { prompt: "incitat", de: ["he urges on", "she urges on", "it urges on", "urges on"] },
      { prompt: "nuntius", de: ["messenger"] },
      { prompt: "pes", de: ["foot"] },
      { prompt: "porta", de: ["gate"] },
      { prompt: "postulat", de: ["he demands", "she demands", "it demands", "demands"] },
      { prompt: "puer", de: ["boy"] },
      { prompt: "pugno", de: ["fight"] },
      { prompt: "saepe", de: ["often"] },
      { prompt: "sanguis", de: ["blood"] },
      { prompt: "spectaculum", de: ["show"] },
      { prompt: "totus", de: ["whole"] }
    ]
  },
  {
    id: 'lat-stage-9',
    badge: 'Stage 9',
    title: 'Cambridge Latin Book 1 • Stage 9',
    lang1: 'la',
    lang2: 'en-GB',
    items: [
      { prompt: "accipit", de: ["he accepts", "she accepts", "it accepts", "accepts"] },
      { prompt: "callidus", de: ["clever"] },
      { prompt: "contentus", de: ["satisfied"] },
      { prompt: "exclamat", de: ["he exclaims", "she exclaims", "it exclaims", "exclaims"] },
      { prompt: "frater", de: ["brother"] },
      { prompt: "habitat", de: ["he lives", "she lives", "it lives", "lives"] },
      { prompt: "imperium", de: ["empire"] },
      { prompt: "invenit", de: ["he finds", "she finds", "it finds", "finds"] },
      { prompt: "liber", de: ["book"] },
      { prompt: "nos", de: ["we"] },
      { prompt: "nuntiat", de: ["he announces", "she announces", "it announces", "announces"] },
      { prompt: "pax", de: ["peace"] },
      { prompt: "portus", de: ["harbour"] },
      { prompt: "quam", de: ["than"] },
      { prompt: "semper", de: ["always"] },
      { prompt: "servat", de: ["he saves", "she saves", "it saves", "saves"] },
      { prompt: "solus", de: ["alone"] },
      { prompt: "suus", de: ["his"] },
      { prompt: "tace", de: ["be quiet"] },
      { prompt: "vehementer", de: ["violently"] },
      { prompt: "vos", de: ["you"] }
    ]
  },
  {
    id: 'lat-stage-10',
    badge: 'Stage 10',
    title: 'Cambridge Latin Book 1 • Stage 10',
    lang1: 'la',
    lang2: 'en-GB',
    items: [
      { prompt: "capit", de: ["he takes", "she takes", "it takes", "takes"] },
      { prompt: "civis", de: ["citizen"] },
      { prompt: "convenit", de: ["he gathers", "she gathers", "it gathers", "gathers"] },
      { prompt: "credit", de: ["he believes", "she believes", "it believes", "believes"] },
      { prompt: "de", de: ["about"] },
      { prompt: "favet", de: ["he supports", "she supports", "it supports", "supports"] },
      { prompt: "invitat", de: ["he invites", "she invites", "it invites", "invites"] },
      { prompt: "it", de: ["he goes", "she goes", "it goes", "goes"] },
      { prompt: "legit", de: ["he reads", "she reads", "it reads", "reads"] },
      { prompt: "liberalis", de: ["generous"] },
      { prompt: "minime!", de: ["no!"] },
      { prompt: "murus", de: ["wall"] },
      { prompt: "noster", de: ["our"] },
      { prompt: "nunc", de: ["now"] },
      { prompt: "placet", de: ["it pleases"] },
      { prompt: "primus", de: ["first"] },
      { prompt: "promittit", de: ["he promises", "she promises", "it promises", "promises"] },
      { prompt: "pugna", de: ["fight"] },
      { prompt: "senator", de: ["senator"] },
      { prompt: "sollicitus", de: ["worried"] },
      { prompt: "stultus", de: ["stupid"] },
      { prompt: "vale!", de: ["goodbye!"] },
      { prompt: "verberat", de: ["he beats", "she beats", "it beats", "beats"] },
      { prompt: "vir", de: ["man"] }
    ]
  },
  {
    id: 'lat-stage-11',
    badge: 'Stage 11',
    title: 'Cambridge Latin Book 1 • Stage 11',
    lang1: 'la',
    lang2: 'en-GB',
    items: [
      { prompt: "amittit", de: ["he loses", "she loses", "it loses", "loses"] },
      { prompt: "complet", de: ["he fills", "she fills", "it fills", "fills"] },
      { prompt: "custodit", de: ["he guards", "she guards", "it guards", "guards"] },
      { prompt: "duo", de: ["two"] },
      { prompt: "epistula", de: ["letter"] },
      { prompt: "flamma", de: ["flame"] },
      { prompt: "fortiter", de: ["bravely"] },
      { prompt: "frustra", de: ["in vain"] },
      { prompt: "fugit", de: ["he flees", "she flees", "it flees", "flees"] },
      { prompt: "fundus", de: ["farm"] },
      { prompt: "jacet", de: ["he lies", "she lies", "it lies", "lies"] },
      { prompt: "igitur", de: ["therefore"] },
      { prompt: "mirabilis", de: ["strange"] },
      { prompt: "mittit", de: ["he sends", "she sends", "it sends", "sends"] },
      { prompt: "mons", de: ["mountain"] },
      { prompt: "optime", de: ["very well"] },
      { prompt: "paene", de: ["almost"] },
      { prompt: "sentit", de: ["he feels", "she feels", "it feels", "feels"] },
      { prompt: "tandem", de: ["at last"] },
      { prompt: "templum", de: ["templum", "temple"] },
      { prompt: "terra", de: ["ground"] },
      { prompt: "timet", de: ["he fears", "she fears", "it fears", "fears"] },
      { prompt: "tres", de: ["three"] }
    ]
  },
  {
    id: 'lat-stage-12',
    badge: 'Stage 12',
    title: 'Cambridge Latin Book 1 • Stage 12',
    lang1: 'la',
    lang2: 'en-GB',
    items: [
      { prompt: "aedifico", de: ["build"] },
      { prompt: "auxilium", de: ["help"] },
      { prompt: "consilium", de: ["plan"] },
      { prompt: "deinde", de: ["then"] },
      { prompt: "igitur", de: ["therefore"] },
      { prompt: "mox", de: ["soon"] },
      { prompt: "neco", de: ["kill"] },
      { prompt: "paratus", de: ["ready"] },
      { prompt: "respondeo", de: ["reply"] },
      { prompt: "rogo", de: ["ask"] },
      { prompt: "terreo", de: ["frighten"] },
      { prompt: "valde", de: ["greatly"] }
    ]
  }
];

// Default starter custom sets so Custom Sets is never empty
export const DEFAULT_CUSTOM_SETS: DeckUnit[] = [
  {
    id: 'custom-german-verbs',
    badge: 'Custom Set',
    title: 'High-Frequency German Verbs',
    lang1: 'de-DE',
    lang2: 'en-GB',
    isCustom: true,
    author: 'Staff Curator',
    items: [
      { prompt: "gehen", de: ["to go", "walk"] },
      { prompt: "sehen", de: ["to see"] },
      { prompt: "sprechen", de: ["to speak"] },
      { prompt: "essen", de: ["to eat"] },
      { prompt: "trinken", de: ["to drink"] },
      { prompt: "fahren", de: ["to drive", "travel"] },
      { prompt: "lesen", de: ["to read"] },
      { prompt: "schreiben", de: ["to write"] },
      { prompt: "schlafen", de: ["to sleep"] },
      { prompt: "hören", de: ["to hear", "listen"] }
    ]
  },
  {
    id: 'custom-latin-maxims',
    badge: 'Custom Set',
    title: 'Everyday Latin Maxims',
    lang1: 'la',
    lang2: 'en-GB',
    isCustom: true,
    author: 'Staff Curator',
    items: [
      { prompt: "carpe diem", de: ["seize the day"] },
      { prompt: "veni, vidi, vici", de: ["I came, I saw, I conquered"] },
      { prompt: "amor fati", de: ["love of fate"] },
      { prompt: "per aspera ad astra", de: ["through hardships to the stars"] },
      { prompt: "memento mori", de: ["remember you will die"] },
      { prompt: "alea iacta est", de: ["the die is cast"] }
    ]
  }
];

// Universal Community Decks (includes starter public sets)
export const UNIVERSAL_COMMUNITY_DECKS: DeckUnit[] = [
  {
    id: 'univ-german-travel',
    badge: 'Universal',
    title: 'German Travel Essentials',
    lang1: 'de-DE',
    lang2: 'en-GB',
    author: 'Staff Curator',
    items: [
      { prompt: "Wo ist der Bahnhof?", de: ["Where is the train station?"] },
      { prompt: "Wie viel kostet das?", de: ["How much does it cost?"] },
      { prompt: "Ein Tisch für zwei, bitte.", de: ["A table for two, please."] },
      { prompt: "Die Rechnung, bitte.", de: ["The bill, please."] },
      { prompt: "Sprechen Sie Englisch?", de: ["Do you speak English?"] },
      { prompt: "Ich möchte ein Wasser.", de: ["I would like a water."] }
    ]
  }
];

export const ALL_TROPHIES: Trophy[] = [
  { id: 'first_quest', title: 'First Steps', desc: 'Complete your 1st quest challenge', icon: '🚀', rarity: 'Bronze', coinReward: 15 },
  { id: 'streak_3', title: 'On Fire', desc: 'Reach a 3-day quest streak', icon: '🔥', rarity: 'Bronze', coinReward: 25 },
  { id: 'streak_7', title: 'Unstoppable Flame', desc: 'Reach a 7-day study streak', icon: '⚡', rarity: 'Silver', coinReward: 50 },
  { id: 'vocab_master', title: 'Vocab Master', desc: 'Earn 100+ Total XP', icon: '🧠', rarity: 'Bronze', coinReward: 20 },
  { id: 'xp_500', title: 'Knowledge Titan', desc: 'Accumulate 500+ Total XP', icon: '💎', rarity: 'Silver', coinReward: 60 },
  { id: 'xp_1000', title: 'Polyglot Sovereign', desc: 'Surpass 1,000 Total XP in the Arena', icon: '👑', rarity: 'Legendary', coinReward: 150 },
  { id: 'speed_demon', title: 'Speed Demon', desc: 'Finish a quiz session in under 45s', icon: '⏱️', rarity: 'Silver', coinReward: 35 },
  { id: 'perfect_100', title: 'Perfectionist', desc: 'Score a perfect 100% on any written quiz', icon: '🎯', rarity: 'Silver', coinReward: 40 },
  { id: 'learn_champion', title: 'Arcade Champion', desc: 'Ace a Multiple Choice (Learn) battle', icon: '🎮', rarity: 'Bronze', coinReward: 20 },
  { id: 'error_slayer', title: 'Error Slayer', desc: 'Complete a test and clear mastered errors', icon: '✨', rarity: 'Silver', coinReward: 30 },
  { id: 'speaking_hero', title: 'Orator Laureate', desc: 'Complete an Oral Speaking Studio trial', icon: '🎙️', rarity: 'Silver', coinReward: 40 },
  { id: 'latin_centurion', title: 'Latin Centurion', desc: 'Study 3 Cambridge Latin stages', icon: '🛡️', rarity: 'Gold', coinReward: 75 },
  { id: 'german_virtuoso', title: 'German Virtuoso', desc: 'Study 3 German Module 2 units', icon: '📖', rarity: 'Gold', coinReward: 75 },
  { id: 'cloud_creator', title: 'Community Pioneer', desc: 'Save or create a custom/universal deck', icon: '☁️', rarity: 'Bronze', coinReward: 25 },
  { id: 'multiplayer_racer', title: 'Arena Duelist', desc: 'Host or join a 6-digit multiplayer game', icon: '⚔️', rarity: 'Gold', coinReward: 60 },
  { id: 'shopaholic', title: 'Style Icon', desc: 'Purchase any cosmetic title from the shop', icon: '🛍️', rarity: 'Gold', coinReward: 50 }
];

export const SHOP_CATALOG: ShopItem[] = [
  // 1. Avatar Photo Backdrops (Real scenic photos to display behind your avatar)
  {
    id: 'photo_colosseum',
    name: 'Roman Colosseum Forum',
    category: 'backdrop',
    price: 35,
    description: 'Classical monumental photography of the Roman Colosseum and ancient Forum',
    preview: 'Colosseum',
    photoUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'photo_cyber_city',
    name: 'Cyberpunk Neon City',
    category: 'backdrop',
    price: 40,
    description: 'Rainy futuristic Tokyo night alley glowing with neon reflections',
    preview: 'Neon City',
    photoUrl: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'photo_nebula',
    name: 'Deep Space Cosmic Nebula',
    category: 'backdrop',
    price: 45,
    description: 'Deep celestial telescope photography of distant starry nebulae',
    preview: 'Cosmic Nebula',
    photoUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'photo_library',
    name: 'Ancient Castle Library',
    category: 'backdrop',
    price: 30,
    description: 'Majestic dark wood book stacks and stained glass reading room',
    preview: 'Ancient Library',
    photoUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'photo_alps',
    name: 'Snowy Alpine Summit',
    category: 'backdrop',
    price: 35,
    description: 'Breathtaking mountain peaks under clear blue alpine skies',
    preview: 'Alpine Alps',
    photoUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'photo_kyoto',
    name: 'Kyoto Cherry Blossom Garden',
    category: 'backdrop',
    price: 40,
    description: 'Traditional serene pagoda surrounded by spring sakura blossoms',
    preview: 'Kyoto Garden',
    photoUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=400&q=80'
  },

  // 2. Avatar Clothes / Outfits
  {
    id: 'outfit_cyber_jacket',
    name: 'Cyberpunk Neon Bomber',
    category: 'outfit',
    price: 40,
    description: 'Luminous augmented jacket with illuminated collars',
    preview: 'Neon Bomber'
  },
  {
    id: 'outfit_scholar_robe',
    name: 'Roman Toga & Scholar Robe',
    category: 'outfit',
    price: 35,
    description: 'Classical drape of prestigious philosophical academies',
    preview: 'Scholar Toga'
  },
  {
    id: 'outfit_wizard_cloak',
    name: 'Arcane Sorcerer Cloak',
    category: 'outfit',
    price: 45,
    description: 'Enchanted star-embroidered velvet cape',
    preview: 'Sorcerer Cloak'
  },
  {
    id: 'outfit_space_suit',
    name: 'Orbital Astronaut Flightsuit',
    category: 'outfit',
    price: 55,
    description: 'Pressurized space gear with mission badges',
    preview: 'Space Suit'
  },
  {
    id: 'outfit_knight_armor',
    name: 'Gladiator Steel Plate Armor',
    category: 'outfit',
    price: 50,
    description: 'Forged colosseum armor with lion crest',
    preview: 'Knight Armor'
  },
  {
    id: 'outfit_tuxedo',
    name: 'Black Velvet Gala Tuxedo',
    category: 'outfit',
    price: 35,
    description: 'Impeccable formal attire with silk bow tie',
    preview: 'Velvet Tuxedo'
  },

  // 3. Avatar Hats & Headwear
  {
    id: 'hat_headset',
    name: 'Gamer Pro RGB Headset',
    category: 'hat',
    price: 25,
    description: 'Noise-cancelling audio headset with neon lights',
    preview: 'RGB Headset'
  },
  {
    id: 'hat_laurel',
    name: 'Caesar Golden Laurel',
    category: 'hat',
    price: 30,
    description: 'Triumphant golden leaves worn by Roman emperors',
    preview: 'Golden Laurel'
  },
  {
    id: 'hat_crown',
    name: 'Monarch Gem Crown',
    category: 'hat',
    price: 50,
    description: 'Ornate sovereign crown adorned with rubies',
    preview: 'Gem Crown'
  },
  {
    id: 'hat_wizard_hat',
    name: 'Pointed Arcane Wizard Hat',
    category: 'hat',
    price: 35,
    description: 'Traditional mystical pointed hat with silver stars',
    preview: 'Wizard Hat'
  },
  {
    id: 'hat_beret',
    name: 'Polyglot Artist Beret',
    category: 'hat',
    price: 20,
    description: 'Chic European wool beret for cultured linguists',
    preview: 'Polyglot Beret'
  },
  {
    id: 'hat_ninja_headband',
    name: 'Stealth Ninja Forehead Protector',
    category: 'hat',
    price: 25,
    description: 'Engraved metal plate headband tied with ribbons',
    preview: 'Ninja Band'
  },

  // 4. Avatar Accessories
  {
    id: 'acc_sunglasses',
    name: 'Mirrored Cyber Shades',
    category: 'accessory',
    price: 20,
    description: 'Futuristic polarized shades with UV telemetry',
    preview: 'Cyber Shades'
  },
  {
    id: 'acc_monocle',
    name: 'Victorian Gold Monocle',
    category: 'accessory',
    price: 25,
    description: 'Refined optical lens on a thin gold chain',
    preview: 'Gold Monocle'
  },
  {
    id: 'acc_gold_chain',
    name: '24K Solid Gold Link Chain',
    category: 'accessory',
    price: 35,
    description: 'Heavy polished chain showing off your language wealth',
    preview: 'Gold Chain'
  },
  {
    id: 'acc_dragon_companion',
    name: 'Pocket Fire Drake',
    category: 'accessory',
    price: 60,
    description: 'Adorable mini baby dragon perched on your shoulder',
    preview: 'Baby Dragon'
  },
  {
    id: 'acc_wand',
    name: 'Elder Sorcerer Wand',
    category: 'accessory',
    price: 30,
    description: 'Carved celestial wood crackling with linguistic magic',
    preview: 'Magic Wand'
  },

  // 5. Power-Ups
  {
    id: 'powerup_streak_freeze',
    name: 'Streak Freeze Shield',
    category: 'powerup',
    price: 40,
    description: 'Freezes your daily streak in ice so missing a day will not reset your progress counter!',
    preview: 'Streak Freeze Shield'
  }
];

/**
 * Heuristic language detection for custom imports:
 * Detects German, Latin, French, Spanish, or English based on keywords and characters.
 */
export function autoDetectLanguages(text: string): { lang1: string; lang2: string; detectedName: string } {
  const lower = text.toLowerCase();

  // German cues: umlauts ä, ö, ü, ß, articles der, die, das, ein, eine
  const germanScore = (lower.match(/[äöüß]/g) || []).length * 3 +
    (lower.match(/\b(der|die|das|ein|eine|und|nicht|ich|wir|sie|ist)\b/g) || []).length;

  // Latin cues: -us, -um, -at, -it, est, canis, puer, filius
  const latinScore = (lower.match(/\b(est|et|non|in|sed|cum|canis|coquus|hortus|mater|pater|servus|via)\b/g) || []).length * 2 +
    (lower.match(/[a-z]+(us|um|at|it|ant|unt)\b/g) || []).length;

  // French cues: é, è, ê, ç, le, la, les, un, une
  const frenchScore = (lower.match(/[éèêçàù]/g) || []).length * 3 +
    (lower.match(/\b(le|la|les|un|une|et|est|dans|avec|pour)\b/g) || []).length;

  // Spanish cues: ñ, ¿, ¡, el, la, los, las
  const spanishScore = (lower.match(/[ñáéíóú¿¡]/g) || []).length * 3 +
    (lower.match(/\b(el|la|los|las|un|una|es|en|por|para)\b/g) || []).length;

  if (latinScore > germanScore && latinScore > frenchScore && latinScore > spanishScore && latinScore >= 3) {
    return { lang1: 'la', lang2: 'en-GB', detectedName: 'Latin & English' };
  }
  if (germanScore > latinScore && germanScore > frenchScore && germanScore >= 3) {
    return { lang1: 'en-GB', lang2: 'de-DE', detectedName: 'English & German' };
  }
  if (frenchScore > 3) {
    return { lang1: 'en-GB', lang2: 'fr-FR', detectedName: 'English & French' };
  }
  if (spanishScore > 3) {
    return { lang1: 'en-GB', lang2: 'es-ES', detectedName: 'English & Spanish' };
  }

  // Default fallback
  return { lang1: 'en-GB', lang2: 'de-DE', detectedName: 'English & German (Default)' };
}
