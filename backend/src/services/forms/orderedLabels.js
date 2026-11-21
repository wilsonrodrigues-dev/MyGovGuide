export function orderedLabels(text,known){const found=[];for(const label of known){const pattern=new RegExp('(?:^|[\\n\\t])\\s*(?:\\d+[.)]?\\s+)?'+label.replace(/[.*+?^{}()|[\]\\$]/g,'\\$&')+'(?=\\s*[:\\n\\t]|\\s{2,}|$)','im'),match=pattern.exec(text);if(match)found.push({label,index:match.index});}
 // Only a bounded colon-delimited label, never its filled value or a paragraph.
 for(const match of text.matchAll(/(?:^|\n)\s*(?:\d+[.)]?\s+)?([A-Za-z][A-Za-z /()&.'-]{1,59})\s*:/g)){const label=match[1].trim();if(!/https?|password|otp|ignore|instructions|system prompt/i.test(label)&&!found.some(f=>f.label.toLowerCase()===label.toLowerCase()))found.push({label,index:match.index});}
 return found.sort((a,b)=>a.index-b.index||b.label.length-a.label.length).slice(0,60).map(f=>f.label);}
