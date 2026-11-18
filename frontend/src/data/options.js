export const categories = ['Farmer', 'Student', 'Senior Citizen', 'Woman', 'Entrepreneur', 'Worker', 'Person with Disability', 'General'];
export const languages = ['en', 'hi', 'kn'];
export const languageNames = { en: 'English', hi: 'हिन्दी', kn: 'ಕನ್ನಡ' };
export const stateLabels = {
  'Andhra Pradesh': ['आंध्र प्रदेश', 'ಆಂಧ್ರ ಪ್ರದೇಶ'], 'Arunachal Pradesh': ['अरुणाचल प्रदेश', 'ಅರುಣಾಚಲ ಪ್ರದೇಶ'],
  Assam: ['असम', 'ಅಸ್ಸಾಂ'], Bihar: ['बिहार', 'ಬಿಹಾರ'], Chhattisgarh: ['छत्तीसगढ़', 'ಛತ್ತೀಸ್‌ಗಢ'], Goa: ['गोवा', 'ಗೋವಾ'],
  Gujarat: ['गुजरात', 'ಗುಜರಾತ್'], Haryana: ['हरियाणा', 'ಹರಿಯಾಣ'], 'Himachal Pradesh': ['हिमाचल प्रदेश', 'ಹಿಮಾಚಲ ಪ್ರದೇಶ'],
  Jharkhand: ['झारखंड', 'ಜಾರ್ಖಂಡ್'], Karnataka: ['कर्नाटक', 'ಕರ್ನಾಟಕ'], Kerala: ['केरल', 'ಕೇರಳ'],
  'Madhya Pradesh': ['मध्य प्रदेश', 'ಮಧ್ಯ ಪ್ರದೇಶ'], Maharashtra: ['महाराष्ट्र', 'ಮಹಾರಾಷ್ಟ್ರ'], Manipur: ['मणिपुर', 'ಮಣಿಪುರ'],
  Meghalaya: ['मेघालय', 'ಮೇಘಾಲಯ'], Mizoram: ['मिज़ोरम', 'ಮಿಜೋರಾಂ'], Nagaland: ['नागालैंड', 'ನಾಗಾಲ್ಯಾಂಡ್'],
  Odisha: ['ओडिशा', 'ಒಡಿಶಾ'], Punjab: ['पंजाब', 'ಪಂಜಾಬ್'], Rajasthan: ['राजस्थान', 'ರಾಜಸ್ಥಾನ'], Sikkim: ['सिक्किम', 'ಸಿಕ್ಕಿಂ'],
  'Tamil Nadu': ['तमिलनाडु', 'ತಮಿಳುನಾಡು'], Telangana: ['तेलंगाना', 'ತೆಲಂಗಾಣ'], Tripura: ['त्रिपुरा', 'ತ್ರಿಪುರಾ'],
  'Uttar Pradesh': ['उत्तर प्रदेश', 'ಉತ್ತರ ಪ್ರದೇಶ'], Uttarakhand: ['उत्तराखंड', 'ಉತ್ತರಾಖಂಡ'], 'West Bengal': ['पश्चिम बंगाल', 'ಪಶ್ಚಿಮ ಬಂಗಾಳ'],
  'Andaman and Nicobar Islands': ['अंडमान और निकोबार द्वीपसमूह', 'ಅಂಡಮಾನ್ ಮತ್ತು ನಿಕೋಬಾರ್ ದ್ವೀಪಗಳು'], Chandigarh: ['चंडीगढ़', 'ಚಂಡೀಗಢ'],
  'Dadra and Nagar Haveli and Daman and Diu': ['दादरा और नगर हवेली और दमन और दीव', 'ದಾದ್ರಾ ಮತ್ತು ನಗರ ಹವೇಲಿ ಹಾಗೂ ದಮನ್ ಮತ್ತು ದಿಯು'],
  Delhi: ['दिल्ली', 'ದೆಹಲಿ'], 'Jammu and Kashmir': ['जम्मू और कश्मीर', 'ಜಮ್ಮು ಮತ್ತು ಕಾಶ್ಮೀರ'], Ladakh: ['लद्दाख', 'ಲಡಾಖ್'],
  Lakshadweep: ['लक्षद्वीप', 'ಲಕ್ಷದ್ವೀಪ'], Puducherry: ['पुदुच्चेरी', 'ಪುದುಚೇರಿ']
};
export const states = Object.keys(stateLabels);
export function stateName(state, language) { return language === 'hi' ? stateLabels[state]?.[0] || state : language === 'kn' ? stateLabels[state]?.[1] || state : state; }
export function isProfile(value) {
  return value && typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length === 3 &&
    states.includes(value.state) && categories.includes(value.category) && languages.includes(value.language);
}
