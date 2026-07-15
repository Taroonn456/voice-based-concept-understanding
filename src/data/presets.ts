import { PresetSample } from "../types";

export const PRESET_SAMPLES: PresetSample[] = [
  {
    id: "preset_ml_strong",
    conceptId: "ml",
    title: "Machine Learning (Strong Explanation)",
    description: "A highly articulated, confident explanation of Machine Learning with clear terms and minimal pauses or filler words.",
    transcript: "So, Machine Learning is basically a major subset of Artificial Intelligence where we teach computers to recognize patterns from data instead of explicitly writing lines of code. There are a few key approaches. First, we have supervised learning where the model trains on labeled data, meaning the inputs are already marked with correct answers. Secondly, we have unsupervised learning which operates on unlabeled data to find hidden structures or groups on its own. And finally, there is reinforcement learning, which learns through trial and error, receiving feedback based on rewards and penalties to improve its policy over time.",
    fillerWords: [
      { word: "so", count: 1 },
      { word: "basically", count: 1 }
    ],
    comprehensionScore: 92,
    semanticSimilarity: 88,
    understandingLevel: "Strong Understanding",
    pointsCovered: [
      "Subset of Artificial Intelligence (AI)",
      "Learning from data patterns without explicit programming",
      "Supervised learning with labeled datasets",
      "Unsupervised learning for hidden structures in unlabeled data",
      "Reinforcement learning through trial, feedback, or rewards"
    ],
    pointsMissed: [],
    aiSummary: "The explanation is excellent, clearly outlining Machine Learning as an AI subset. The user perfectly defined the three primary learning paradigms: supervised (labeled data), unsupervised (discovering hidden structures), and reinforcement (trial and error with rewards). The vocabulary was precise, and the response was structured exceptionally well.",
    deliveryFeedback: "Your verbal delivery is outstanding! You maintained a solid, steady speaking rate of approximately 140 words per minute. Hesitations were virtually non-existent, and you only used two minor filler words ('so' and 'basically'). The overall articulation demonstrates high confidence and deep mastery of the topic.",
    improvementTips: [
      "Excellent job! To make this perfect, try mentioning a real-world application (e.g., image recognition or spam filtering) to ground the explanation further.",
      "Keep practicing this pacing; the 1.5-second pauses between key transitions help the listener absorb complex terms.",
      "Consider introducing the concept of testing/validation splits to show even deeper technical knowledge."
    ],
    duration: 32,
    pauseRatio: 0.08,
    totalPauses: 2,
    averageVolume: 0.18,
    rmsLevels: [
      0.02, 0.12, 0.15, 0.18, 0.20, 0.16, 0.02, 0.01, 0.14, 0.19, 0.22, 0.18, 0.15, 0.12, 0.01, 0.02,
      0.15, 0.18, 0.21, 0.19, 0.17, 0.15, 0.01, 0.02, 0.16, 0.20, 0.18, 0.19, 0.14, 0.12, 0.04, 0.01
    ],
    pauseTimeline: [
      { start: 0, end: 6, type: "speech" },
      { start: 6, end: 7.5, type: "pause" },
      { start: 7.5, end: 14, type: "speech" },
      { start: 14, end: 15.5, type: "pause" },
      { start: 15.5, end: 22, type: "speech" },
      { start: 22, end: 32, type: "speech" }
    ]
  },
  {
    id: "preset_cc_moderate",
    conceptId: "cc",
    title: "Cloud Computing (Hesitant Explanation)",
    description: "An explanation of Cloud Computing that covers several core aspects but includes multiple filler words, longer hesitation pauses, and misses security/provider points.",
    transcript: "Um, okay. So, Cloud Computing is... well, it's basically when you deliver computing services over the internet. Like, instead of having a physical server or a big computer in your office, you can just rent it. You can get, um, storage, compute power, and databases online. And you only pay for what you actually use, which is like a pay-as-you-go model. So, yeah, it's very scalable because you can get more space anytime, but... uh... I forgot what else. I guess that is what it is.",
    fillerWords: [
      { word: "um", count: 2 },
      { word: "uh", count: 1 },
      { word: "like", count: 2 },
      { word: "so", count: 2 },
      { word: "basically", count: 1 }
    ],
    comprehensionScore: 70,
    semanticSimilarity: 64,
    understandingLevel: "Moderate Understanding",
    pointsCovered: [
      "On-demand delivery of IT services (compute, storage, databases) over the internet",
      "Pay-as-you-go pricing model (pay only for used resources)",
      "High scalability and resource elasticity (scaling up or down dynamically)"
    ],
    pointsMissed: [
      "Elimination of physical data center ownership and maintenance",
      "Major cloud providers (such as AWS, Microsoft Azure, Google Cloud)"
    ],
    aiSummary: "The speaker demonstrates a sound basic understanding of Cloud Computing, correctly highlighting on-demand service delivery, remote storage/compute, pay-as-you-go billing, and scalability. However, they failed to discuss the direct business value of eliminating physical data center overhead and did not list any major cloud providers.",
    deliveryFeedback: "Your delivery is moderately fluent but is heavily impacted by hesitations and filler words. You used 8 filler words ('um', 'uh', 'like', 'so') in a span of 38 seconds. The pause ratio of 21% is quite high, signaling hesitation, especially toward the end where you trailed off.",
    improvementTips: [
      "Try to structuralize your response: first state the definition, then list the benefits, then give examples of providers.",
      "Before speaking, take 5 seconds to mentally list key points so you don't run out of ideas mid-explanation.",
      "Work on pausing silently instead of filling the silence with 'um' or 'uh' to sound more authoritative and clear."
    ],
    duration: 38,
    pauseRatio: 0.21,
    totalPauses: 5,
    averageVolume: 0.12,
    rmsLevels: [
      0.01, 0.08, 0.01, 0.02, 0.09, 0.11, 0.13, 0.10, 0.02, 0.01, 0.08, 0.12, 0.14, 0.01, 0.02, 0.01,
      0.09, 0.11, 0.12, 0.10, 0.01, 0.02, 0.10, 0.13, 0.11, 0.08, 0.01, 0.01, 0.07, 0.09, 0.01, 0.02,
      0.01, 0.01, 0.05, 0.06, 0.01, 0.01
    ],
    pauseTimeline: [
      { start: 0, end: 2, type: "pause" },
      { start: 2, end: 8, type: "speech" },
      { start: 8, end: 10, type: "pause" },
      { start: 10, end: 13, type: "speech" },
      { start: 13, end: 16, type: "pause" },
      { start: 16, end: 20, type: "speech" },
      { start: 20, end: 22, type: "pause" },
      { start: 22, end: 26, type: "speech" },
      { start: 26, end: 28, type: "pause" },
      { start: 28, end: 30, type: "speech" },
      { start: 30, end: 34, type: "pause" },
      { start: 34, end: 38, type: "speech" }
    ]
  },
  {
    id: "preset_rest_poor",
    conceptId: "rest",
    title: "REST API (Vague/Poor Explanation)",
    description: "A short, disjointed, and highly anxious explanation of REST API. It has excessive fillers, long periods of silence, and misses most structural API concepts.",
    transcript: "Uh, so... a REST API is... like, something we use in coding to, you know, connect the front-end to... like, the database, I think. It, uh, uses URL links... or wait, HTTP, yeah. And, um... it's like, representational... something state transfer. But, er... honestly, I don't really remember the rest of it... it's just about, you know, getting data, I guess.",
    fillerWords: [
      { word: "uh", count: 2 },
      { word: "um", count: 1 },
      { word: "like", count: 3 },
      { word: "you know", count: 2 },
      { word: "so", count: 1 },
      { word: "er", count: 1 }
    ],
    comprehensionScore: 40,
    semanticSimilarity: 35,
    understandingLevel: "Poor Understanding",
    pointsCovered: [
      "Stateless client-server communication using standard HTTP protocol",
      "Data representation typically transferred in standard formats (JSON or XML)"
    ],
    pointsMissed: [
      "Architectural style for web services based on Representational State Transfer",
      "Identification of resources using Uniform Resource Identifiers (URIs)",
      "Standard HTTP verbs/methods (GET for reading, POST for creating, PUT for updating, DELETE for deleting)"
    ],
    aiSummary: "The explanation is fragmented and highly anxious, reflecting a weak grasp of REST architecture. The user correctly remembered that it represents 'Representational State Transfer' and involves HTTP and fetching data. However, they missed the core concepts of statelessness, resource identification via URIs, and the standard CRUD verbs (GET, POST, PUT, DELETE).",
    deliveryFeedback: "Your spoken delivery reflects severe hesitation and anxiety. You spoke for 28 seconds but spent 10 seconds of that time in silences or filler vocalizations. You used 10 filler words for a very short, 45-word transcript. The delivery felt highly disjointed.",
    improvementTips: [
      "Familiarize yourself with the HTTP verbs (GET, POST, PUT, DELETE) and practice explaining what each does. This gives you a solid list of bullet points to explain next time.",
      "To reduce vocal fillers, practice speaking in shorter, distinct sentences. Complete a sentence, stop, breathe, and then start the next sentence.",
      "Write down a 3-sentence summary of REST API and read it aloud multiple times to build tongue and muscle memory for these terms."
    ],
    duration: 28,
    pauseRatio: 0.35,
    totalPauses: 4,
    averageVolume: 0.08,
    rmsLevels: [
      0.01, 0.05, 0.01, 0.01, 0.06, 0.01, 0.01, 0.05, 0.07, 0.01, 0.01, 0.01, 0.01, 0.06, 0.01, 0.01,
      0.04, 0.05, 0.01, 0.01, 0.01, 0.01, 0.05, 0.04, 0.01, 0.01, 0.03, 0.01
    ],
    pauseTimeline: [
      { start: 0, end: 2, type: "pause" },
      { start: 2, end: 5, type: "speech" },
      { start: 5, end: 7, type: "pause" },
      { start: 7, end: 9, type: "speech" },
      { start: 9, end: 13, type: "pause" },
      { start: 13, end: 18, type: "speech" },
      { start: 18, end: 22, type: "pause" },
      { start: 22, end: 28, type: "speech" }
    ]
  }
];
