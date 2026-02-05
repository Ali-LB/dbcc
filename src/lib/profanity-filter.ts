// List of NSFW and profanity words to filter out of usernames
const PROFANITY_WORDS = [
  // Common profanity
  'fuck', 'shit', 'bitch', 'ass', 'dick', 'cock', 'pussy', 'cunt',
  'whore', 'slut', 'bastard', 'motherfucker', 'fucker', 'shithead',
  'asshole', 'dumbass', 'jackass', 'dickhead', 'cockhead', 'pussycat',
  
  // Variations and common misspellings
  'fuk', 'fuq', 'fck', 'shyt', 'sh1t', 'b1tch', 'b!tch', 'a$$', 'a55',
  'd1ck', 'd!ck', 'c0ck', 'c0k', 'puss', 'puzzy', 'kunt', 'wh0re',
  'sl*t', 'b@stard', 'm0therfucker', 'f*ck', 'f*cker', 'sh1thead',
  'a$$hole', 'a55hole', 'dumb@ss', 'j@ckass', 'd1ckhead', 'c0ckhead',
  
  // Common offensive terms
  'nazi', 'hitler', 'racist', 'sexist', 'homophobe', 'bigot',
  'terrorist', 'pedo', 'pedophile', 'rapist', 'murderer', 'killer',
  
  // NSFW terms
  'porn', 'xxx', 'adult', 'sex', 'sexual', 'nude', 'naked', 'penis',
  'vagina', 'boobs', 'tits', 'ass', 'butt', 'dick', 'cock', 'pussy',
  
  // Common gaming/online profanity
  'noob', 'nub', 'newb', 'newbie', 'scrub', 'trash', 'garbage', 'useless',
  'worthless', 'stupid', 'idiot', 'moron', 'retard', 'retarded',
  
  // Additional variations
  'n00b', 'nub', 'scrub', 'tr@sh', 'g@rbage', 'us3less', 'w0rthless',
  'st00pid', '1diot', 'm0ron', 'ret@rd', 'ret@rded'
];

export function containsProfanity(text: string): boolean {
  const normalizedText = text.toLowerCase().replace(/[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g, '');
  
  return PROFANITY_WORDS.some(word => 
    normalizedText.includes(word.toLowerCase())
  );
}

export function isUsernameValid(username: string): { valid: boolean; error?: string } {
  // Check length
  if (username.length < 4) {
    return { valid: false, error: 'Username must be at least 4 characters long' };
  }
  
  // Check for profanity
  if (containsProfanity(username)) {
    return { valid: false, error: 'Username contains inappropriate content' };
  }
  
  // Check for valid characters (alphanumeric, underscore, hyphen)
  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    return { valid: false, error: 'Username can only contain letters, numbers, underscores, and hyphens' };
  }
  
  return { valid: true };
} 