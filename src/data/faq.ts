import { FaqItem } from "@/models/FaqItem";

export const faqItems: FaqItem[] = [
  {
    id: "what-is-hamster",
    question: "Vad är Hamster?",
    answer:
      "Hamster är till för dig som samlar på LEGO och vill hitta nästa guldkorn till samlingen. Leta upp ett set du gillar och få en snabb överblick över Tradera-auktioner som matchar just det setet – utan att sitta och gissa sökord och scrolla i all evighet. Du kan också markera vilka set du har och vilka du vill hålla lite extra koll på.",
  },
  {
    id: "how-do-i-use",
    question: "Hur kommer jag igång?",
    answer:
      "Börja i Utforska och sök fram ett set (setnummer funkar alltid fint om du vill vara exakt). Öppna setet för att se detaljer och matchande Tradera-annonser. Vill du hålla ordning? Markera setet som med “bevaka” eller “samla” för att lägga dem i dina egna listor och för att lätt hitta tillbaka.",
  },
  {
    id: "mobile",
    question: "Funkar Hamster på mobilen?",
    answer:
      "Japp! Hamster funkar på både mobil och dator. På mobilen är det samma innehåll, bara lite mer kompakt så tummen hänger med.",
  },

  // Hitta set
  {
    id: "find-set",
    question: "Hur hittar jag ett visst set?",
    answer:
      "Sök i Utforska med setnummer eller några ord ur namnet. Du kan också bläddra via teman och välja årtal för att smalna av jakten.",
  },
  {
    id: "no-results",
    question: "Varför får jag inga träffar?",
    answer:
      "Det händer oftast när sökningen är lite för smal eller när ett filter råkar utesluta allt (till exempel årtal). Prova att plocka bort filter, skriva mindre, eller testa setnumret istället. Ibland kan det också vara en tillfällig svacka – testa igen om en stund.",
  },
  {
    id: "show-more",
    question: "Varför ser jag bara några set åt gången?",
    answer:
      'För att sidan ska kännas snabb och inte tvinga dig att scrolla dig in i nästa vecka. Resultaten visas i omgångar, så du kan bläddra vidare när du vill se fler genom att klicka på "Hämta fler".',
  },
  {
    id: "english-names",
    question: "Varför är vissa namn och teman på engelska?",
    answer:
      "En del namn och teman kommer från samma källa som setinformationen, och då blir det engelska rakt av. Jag vet – det hade varit mysigt med allt på svenska, men här får vi leva lite internationellt. Setnummer är annars ett säkert kort om du vill hitta exakt rätt.",
  },

  // Samla & bevaka
  {
    id: "icons-meaning",
    question: "Vad betyder ögat och list-ikonen?",
    answer:
      'Ögat är för att bevaka, list-ikonen är för att markera att du har setet. När ett set finns i en lista blir ikonen lite större och grön. Klickar du på ikonen igen, tar du bort setet från listan. Vill du se alla dina set i dina listor kan du besöka "Bevaka" eller "Samling".',
  },
  {
    id: "have-vs-watch",
    question: "Varför kan jag inte både ha och bevaka samma set?",
    answer:
      "För att det ska vara glasklart vad som faktiskt står på hyllan hemma och vad du fortfarande jagar. Ett set får därför bara ha en markering åt gången. Vill du ändra, klicka bara på den andra ikonen så löser Hamster resten.",
  },

  // Tradera
  {
    id: "why-tradera",
    question: "Varför visar Hamster Tradera-annonser på setet?",
    answer:
      "För att du ska slippa hoppa fram och tillbaka mellan flikar och gissa dig fram till rätt sökord. Du får en snabb känsla för om setet finns ute just nu och vad det verkar kosta. Perfekt när du är sugen på ett set och vill se läget direkt. Du kan också snabbt se när auktionerna slutar, så du vet om du behöver agera nu eller kan vänta.",
  },
  {
    id: "",
    question: "Kan jag se när auktioner slutar?",
    answer:
      'Absolut! På varje annons står sluttiden och hur mycket tid som är kvar, så du snabbt kan se hur bråttom det är. Perfekt om du vill hålla koll på när det är dags att lägga bud. Du kan även se aktuellt högsta bud och om det finns möjlighet att köpa setet till ett fast pris med "Köp nu"',
  },
  {
    id: "no-tradera",
    question: "Varför ser jag inga Tradera-annonser ibland?",
    answer:
      "Ibland finns det helt enkelt inga passande annonser just nu – Tradera lever sitt eget liv. Det kan också vara så att annonser precis har försvunnit eller bytts ut. Prova att kika in igen senare om du misstänker att det bara är timing, glöm inte att lägga en bevakning på setet så hittar du snabbt tillbaka",
  },
  {
    id: "cache-label",
    question: "Vad betyder “Visas från cache”?",
    answer:
      "Det betyder att Hamster visar en sparad version av annonserna för att det ska gå snabbt och smidigt. Tiden bredvid visar när listan senast hämtades. Annonser kan ha hunnit ändras på Tradera sedan dess, så se det som en “senaste koll”.",
  },
  {
    id: "live-label",
    question: "Vad betyder “Hämtad live”?",
    answer:
      "Det betyder att Hamster precis hämtade en färsk lista från Tradera. Alltså: så uppdaterat det kan bli just nu. Efter det kan samma lista visas som “Visas från cache” ett tag, så att du slipper vänta varje gång du öppnar setet.",
  },
  {
    id: "why-not-live-every-time",
    question: "Varför hämtas inte Tradera-annonser live varje gång?",
    answer:
      "För att Hamster inte ska springa i onödan och hämta samma sak om och om igen. Därför sparas listan i 24 timmar, och under den tiden visas den sparade versionen. Vill du se om något ändrats? Besök setet igen senare – när tiden gått ut hämtas en ny lista nästa gång.",
  },

  // Spara & integritet
  {
    id: "is-it-saved",
    question: "Sparas det jag lägger i mina listor?",
    answer:
      "Yes! Det du lägger i dina listor sparas i webbläsaren på den här enheten. Så när du kommer tillbaka senare ligger allt kvar precis som du lämnade det. Men om du öppnar Hamster på en annan enhet eller i en annan webbläsare börjar listorna om där.",
  },
  {
    id: "lost-markings",
    question: "Varför försvann saker ur mina listor?",
    answer:
      "Oftast beror det på att du har rensat webbplatsdata i webbläsaren, eller bytt enhet/webbläsare. Då kan listorna nollställas och du behöver lägga in seten igen. Lite surt – men det går som tur är ganska snabbt att fixa.",
  },
  {
    id: "privacy",
    question: "Ser någon annan mina listor?",
    answer:
      "Nej. Dina listor sparas bara hos dig i webbläsaren och delas inte med andra. De synkas inte heller automatiskt mellan enheter. Så du kan samla och bevaka helt i lugn och ro.",
  },
];
