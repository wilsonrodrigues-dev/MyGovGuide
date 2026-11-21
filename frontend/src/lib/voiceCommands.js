import {states,stateLabels,categories} from '../data/options.js';
const clean=text=>String(text).normalize('NFKC').toLocaleLowerCase().replace(/[.!?।,]/g,'').trim();
const categoryNames={Farmer:['farmer','farmers','किसान','ರೈತ'],Student:['student','students','विद्यार्थी','छात्र','ವಿದ್ಯಾರ್ಥಿ'],'Senior Citizen':['senior citizen','वरिष्ठ नागरिक','ಹಿರಿಯ ನಾಗರಿಕ'],Woman:['woman','women','महिला','ಮಹಿಳೆ'],Entrepreneur:['entrepreneur','उद्यमी','ಉದ್ಯಮಿ'],Worker:['worker','कामगार','ಕಾರ್ಮಿಕ'],'Person with Disability':['person with disability','दिव्यांग','ಅಂಗವೈಕಲ್ಯ'],General:['general','सामान्य','ಸಾಮಾನ್ಯ']};
const routes={'home':'/home','मुखपृष्ठ':'/home','ಮುಖಪುಟ':'/home','schemes':'/schemes','योजनाएँ':'/schemes','ಯೋಜನೆಗಳು':'/schemes','forms':'/forms','फ़ॉर्म':'/forms','ಫಾರ್ಮ್':'/forms','notices':'/notices','नोटिस':'/notices','ನೋಟಿಸ್':'/notices','scam alerts':'/alerts','centers':'/centers','preferences':'/settings'};
const contains=(text,term)=>/^[a-z ]+$/.test(term)?new RegExp('(?:^|\\s)'+term+'(?:$|\\s)').test(text):text.includes(term);
export function resolveVoiceCommand(input,{results=[],resultType,fields=[]}={}){
 const text=clean(input).slice(0,240);if(!text)return null;
 if(/^(explain this notice|यह नोटिस समझाएँ|ಈ ನೋಟಿಸ್ ವಿವರಿಸಿ)$/.test(text))return{action:'read_section',section:'summary'};
 if(/^(read next action|अगला कार्य पढ़ें|ಮುಂದಿನ ಕೆಲಸ ಓದಿ)$/.test(text)&&fields.length)return{action:'read_next_action'};
 if(/^(read current question|repeat question|explain this condition|वर्तमान प्रश्न पढ़ें|प्रश्न दोहराएँ|यह शर्त समझाएँ|ಈ ಪ್ರಶ್ನೆ ಓದಿ|ಪ್ರಶ್ನೆ ಪುನರಾವರ್ತಿಸಿ|ಈ ಷರತ್ತು ವಿವರಿಸಿ)$/.test(text))return{action:'read_section',section:'question'};
 if(/^(open eligibility|check eligibility|पात्रता जाँचें|ಅರ್ಹತೆ ಪರಿಶೀಲಿಸಿ)$/.test(text))return{action:'navigate',path:'/eligibility'};
 if(/^(next question|next action|अगला प्रश्न|अगला कार्य|ಮುಂದಿನ ಪ್ರಶ್ನೆ|ಮುಂದಿನ ಕೆಲಸ)$/.test(text)&&fields.length)return{action:'next_field'};
 if(/^(previous question|previous action|पिछला प्रश्न|पिछला कार्य|ಹಿಂದಿನ ಪ್ರಶ್ನೆ|ಹಿಂದಿನ ಕೆಲಸ)$/.test(text)&&fields.length)return{action:'previous_field'};
 if(/^(read question|explain question|प्रश्न पढ़ें|प्रश्न समझाएँ|ಪ್ರಶ್ನೆ ಓದಿ|ಪ್ರಶ್ನೆ ವಿವರಿಸಿ)$/.test(text))return{action:'read_section',section:'question'};
 if(/^(read results|परिणाम पढ़ें|ಫಲಿತಾಂಶ ಓದಿ)$/.test(text))return{action:'read_section',section:'results'};
 if(/^(read checklist|कार्य सूची पढ़ें|ಕೆಲಸದ ಪಟ್ಟಿ ಓದಿ)$/.test(text))return{action:'read_section',section:'checklist'};
 if(fields.length){
  if(/^(next field|अगला खाना|अगला फ़ील्ड|ಮುಂದಿನ ವಿಭಾಗ|ಮುಂದಿನ ಕ್ಷೇತ್ರ)$/.test(text))return{action:'next_field'};
  if(/^(previous field|पिछला खाना|पिछला फ़ील्ड|ಹಿಂದಿನ ವಿಭಾಗ|ಹಿಂದಿನ ಕ್ಷೇತ್ರ)$/.test(text))return{action:'previous_field'};
  if(/^(repeat explanation|repeat|व्याख्या फिर सुनें|फिर सुनाएँ|ವಿವರಣೆಯನ್ನು ಮತ್ತೆ ಕೇಳಿ|ಮತ್ತೆ ಹೇಳಿ)$/.test(text))return{action:'repeat_field'};
  if(/^(explain selected field|explain this field|चुना हुआ खाना समझाएँ|ಆಯ್ದ ವಿಭಾಗ ವಿವರಿಸಿ)$/.test(text))return{action:'explain_field'};
  const digits=text.replace(/[०-९]/g,c=>String(c.charCodeAt(0)-0x966)).replace(/[೦-೯]/g,c=>String(c.charCodeAt(0)-0xce6));
  const go=digits.match(/(?:go to |select |खाना |खाने |ವಿಭಾಗ |ಕ್ಷೇತ್ರ )?(?:field\s*)?(\d+)(?: पर जाएँ|ಕ್ಕೆ ಹೋಗಿ)?$/);
  if(go&&/field|खाना|खाने|ವಿಭಾಗ|ಕ್ಷೇತ್ರ/.test(text)&&!/read|पढ़|ಓದ/.test(text)){const field=fields[Number(go[1])-1];return field?{action:'select_field',id:field.id}:null;}
 }
 if(/^(open forms help|forms help|फ़ॉर्म सहायता|ಫಾರ್ಮ್ ಸಹಾಯ)$/.test(text))return{action:'navigate',path:'/forms'};
 if(/read|पढ़|ಓದ/.test(text)&&/field|instructions|खाने|निर्देश|ವಿಭಾಗ|ಸೂಚನೆ/.test(text)){
  const number=text.match(/(?:field|खाना|ವಿಭಾಗ)\s*(\d+)/);if(number){const field=fields[Number(number[1])-1];return field?{action:'read_field',id:field.id}:null;}
  const field=fields.find(f=>text.includes(clean(f.label)));return field?{action:'read_field',id:field.id}:{action:'read_section',section:'instructions'};
 }

 if(/^(disable voice|turn off voice|आवाज़ बंद(?: करें)?|ಧ್ವನಿ (?:ನಿಲ್ಲಿಸಿ|ಆಫ್ ಮಾಡಿ))$/.test(text))return{action:'disable_voice'};
 if(/^(stop|stop reading|stop readback|रुको|रोकें|पढ़ना रोकें|ನಿಲ್ಲಿಸಿ|ಓದುವುದನ್ನು ನಿಲ್ಲಿಸಿ)$/.test(text))return{action:'stop_readback'};
 const languages={en:['english','अंग्रेजी','ಇಂಗ್ಲಿಷ್'],hi:['hindi','हिन्दी','हिंदी','ಹಿಂದಿ'],kn:['kannada','ಕನ್ನಡ','कन्नड़']};
 for(const [language,names]of Object.entries(languages))if(names.some(n=>text===n||text.endsWith(' '+n))&&/language|भाषा|ಭಾಷೆ|^(english|hindi|kannada|हिन्दी|हिंदी|ಕನ್ನಡ|ಅಂಗ्रेजी|ಇಂಗ್ಲಿಷ್)/.test(text))return{action:'change_language',language};
 for(const [name,path]of Object.entries(routes))if(text===name||text===`go to ${name}`||text===`open ${name}`||text===`${name} खोलें`||text===`${name} ತೆರೆಯಿರಿ`)return{action:'navigate',path};
 const matches=categories.filter(c=>categoryNames[c].some(n=>contains(text,n)));
 if(/^(find|search|look for|खोज|ढूंढ|ಹುಡು)/.test(text)||/(खोजें|ಹುಡುಕಿ)$/.test(text))return{action:'search',query:text.replace(/^(find|search(?: for)?|look for|खोजें|खोज|ढूंढें|ಹುಡುಕಿ)\s*/,'').replace(/\s*(खोजें|ಹುಡುಕಿ)$/,'').replace(/\s*(schemes?|योजनाएँ|योजना|ಯೋಜನೆಗಳು)\s*$/,'').trim()||text,...(matches.length===1?{category:matches[0]}:{})};
 if(/read|पढ़|ಓದ/.test(text)){const section=/benefit|लाभ|प्रयोजन|ಪ್ರಯೋಜನ/.test(text)?'benefits':/document|दस्तावेज|ದಾಖಲೆ/.test(text)?'documents':/appl|आवेदन|ಅರ್ಜಿ/.test(text)?'apply':/summary|explanation|विवरण|ವಿವರಣೆ/.test(text)?'summary':null;if(section)return{action:'read_section',section};}
 if(/^(open|select|खोलें|ತೆರೆಯಿರಿ)/.test(text)){
  const target=text.replace(/^(open|select|खोलें|ತೆರೆಯಿರಿ)\s*/,'').replace(/^(the )?(scheme |result |form )?/,'');const ordinal={'first':0,'second':1,'third':2,'पहला':0,'दूसरा':1,'ಮೊದಲ':0,'ಎರಡನೇ':1};const index=Object.hasOwn(ordinal,target)?ordinal[target]:/^\d+$/.test(target)?Number(target)-1:null;
  if(index!==null)return results[index]?{action:resultType==='form'?'open_form':'open_scheme',choices:[results[index]],confirm:true}:null;
  const choices=results.filter(r=>clean(r.title).includes(target)||clean(r.id)===target);return choices.length?{action:resultType==='form'?'open_form':'open_scheme',choices,confirm:true}:null;
 }
 const stateMatches=states.filter(s=>[s,...stateLabels[s]].some(n=>text===clean(n)||text.endsWith(' '+clean(n))));
 if(stateMatches.length===1)return{action:'set_onboarding_field',field:'state',value:stateMatches[0],confirm:true};
 if(matches.length)return{action:'set_onboarding_field',field:'category',choices:matches,confirm:true};
 return null;
}
export const resultSignature=results=>JSON.stringify(results.map(r=>[r.id,r.title]));
