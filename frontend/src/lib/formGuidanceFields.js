// The official inventory determines which fields exist. A missing translation
// must not silently hide a field or borrow a different field's explanation.
export function formGuidanceFields(detail){
 const guidance=new Map((detail?.guidance?.fields||[]).map(f=>[f.id,f]));
 return (detail?.fields||[]).map(source=>{
  const translated=guidance.get(source.id);
  if(!translated||translated.originalLabel!==source.label||translated.page&&translated.page!==source.page)return {...source,needsVerification:true};
  return {...source,...translated,page:source.page};
 });
}
