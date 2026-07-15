import { ReactElement, useMemo, useState, useEffect } from "react";
import {
View,
Text,
TextInput,
TouchableOpacity,
FlatList,
StyleSheet,
Pressable,
Image,
ImageSourcePropType
} from "react-native";
import { mergeNativeStyles } from "@mendix/pluggable-widgets-tools";
import { DropdownNativeProps } from "../typings/DropdownNativeProps";
type Option={
id:string;
label:string;
};
export function DropdownNative(props: DropdownNativeProps<any>): ReactElement {
const styles=mergeNativeStyles(defaultStyles,props.style);
const [open,setOpen]=useState(false);
const [search,setSearch]=useState("");
const [selected,setSelected]=useState<string[]>([]);
const arrowSource=props.arrowImage?.value as ImageSourcePropType;
const leftImageSource=props.leftImage?.value as ImageSourcePropType;
const options=useMemo<Option[]>(()=>{
return (props.options??"")
.split(",")
.map((item,index)=>({
id:index.toString(),
label:item.trim()
}))
.filter(item=>item.label.length>0);
},[props.options]);
useEffect(()=>{
const value=props.value.displayValue??"";
if(!value){
setSelected([]);
setSearch("");
return;
}
if(props.multiSelect){
setSelected(
value
.split(",")
.map(v=>v.trim())
.filter(v=>v.length>0)
);
}else{
setSelected([value]);
const option=options.find(o=>o.id===value);
if(option){
setSearch(option.label);
}
}
},[props.value.displayValue,props.multiSelect,options]);
const filteredOptions=useMemo(()=>{
if(!search.trim()){
return options;
}
return options.filter(item=>
item.label.toLowerCase().includes(search.toLowerCase())
);
},[search,options]);
const selectedDisplay=useMemo(()=>{
return selected
.map(id=>options.find(o=>o.id===id)?.label)
.filter((v):v is string=>Boolean(v));
},[selected,options]);
const selectItem=(item:Option)=>{
if(props.multiSelect){
let values:string[];
if(selected.includes(item.id)){
values=selected.filter(v=>v!==item.id);
}else{
values=[...selected,item.id];
}
setSelected(values);
props.value.setValue(values.join(","));
}else{
setSelected([item.id]);
props.value.setValue(item.id);
setSearch(item.label);
setOpen(false);
}
if(props.onChange?.canExecute){
props.onChange.execute();
}
};
return(
<View style={styles.container}>
{open&&(
<Pressable
style={styles.absoluteFill}
onPress={()=>{
setOpen(false);
if(props.multiSelect){
setSearch("");
}
}}
/>
)}
<View style={styles.inputContainer}>
<View style={styles.inputWrapper}>
{leftImageSource&&(
<Image
source={leftImageSource}
style={styles.leftImage}
/>
)}
<TextInput
style={styles.input}
value={
open
?search
:props.multiSelect
?selectedDisplay.join(", ")
:search
}
editable
placeholder={props.placeholder||"Select"}
onFocus={()=>{
setOpen(true);
if(!props.multiSelect){
setSearch("");
}
}}
onChangeText={text=>{
setSearch(text);
}}
/>
{arrowSource&&(
<TouchableOpacity
style={styles.arrowContainer}
activeOpacity={0.8}
onPress={()=>{
const next=!open;
setOpen(next);
if(next&&!props.multiSelect){
setSearch("");
}
}}
>
<Image
source={arrowSource}
style={[
styles.arrow,
{
transform:[
{
rotate:open?"180deg":"0deg"
}
]
}
]}
/>
</TouchableOpacity>
)}
</View>
</View>
{open&&(
<View style={styles.dropdown}>
<FlatList
data={filteredOptions}
keyExtractor={item=>item.id}
keyboardShouldPersistTaps="handled"
nestedScrollEnabled
showsVerticalScrollIndicator={true}
renderItem={({item})=>{
const isSelected=selected.includes(item.id);
return(
<TouchableOpacity
style={styles.item}
onPress={()=>selectItem(item)}
>
{props.multiSelect?(
<View
style={[
styles.checkBox,
isSelected&&styles.checkedBox
]}
>
{isSelected&&(
<View style={styles.checkMark}/>
)}
</View>
):(
<View style={styles.radioOuter}>
{isSelected&&(
<View style={styles.radioInner}/>
)}
</View>
)}
<Text style={styles.itemText}>
{item.label}
</Text>
</TouchableOpacity>
);
}}
ListEmptyComponent={
<Text style={styles.emptyText}>
No options found
</Text>
}
/>
</View>
)}
</View>
);
}
const defaultStyles=StyleSheet.create({
container:{
width:"100%",
position:"relative",
zIndex:999,
elevation:999
},
absoluteFill:{
position:"absolute",
top:-1000,
left:-1000,
right:-1000,
bottom:-1000
},
inputContainer:{
width:"100%"
},
inputWrapper:{
height:45,
borderWidth:1,
borderColor:"#CCCCCC",
borderRadius:6,
backgroundColor:"#FFFFFF",
flexDirection:"row",
alignItems:"center"
},
leftImage:{
width:20,
height:20,
marginLeft:12,
marginRight:8
},
input:{
flex:1,
height:"100%",
padding:0,
fontSize:15,
color:"#222222"
},
arrowContainer:{
width:45,
height:"100%",
justifyContent:"center",
alignItems:"center"
},
arrow:{
width:20,
height:20
},
dropdown:{
position:"absolute",
top:48,
left:0,
right:0,
backgroundColor:"#FFFFFF",
borderWidth:1,
borderColor:"#CCCCCC",
borderBottomLeftRadius:8,
borderBottomRightRadius:8,
overflow:"hidden",
elevation:20,
zIndex:99999,
maxHeight:300
},
item:{
flexDirection:"row",
alignItems:"center",
minHeight:48,
paddingHorizontal:12,
paddingVertical:12,
backgroundColor:"#FFFFFF"
},
itemText:{
flex:1,
fontSize:15,
color:"#222222"
},
radioOuter:{
width:20,
height:20,
borderRadius:10,
borderWidth:1,
borderColor:"#212121",
justifyContent:"center",
alignItems:"center",
marginRight:12
},
radioInner:{
width:10,
height:10,
borderRadius:5,
backgroundColor:"#212121"
},
checkBox:{
width:20,
height:20,
borderWidth:1,
borderRadius:3,
borderColor:"#212121",
justifyContent:"center",
alignItems:"center",
marginRight:12,
backgroundColor:"#FFFFFF"
},
checkedBox:{
backgroundColor:"#FFFFFF"
},
checkMark:{
width:12,
height:12,
backgroundColor:"#212121",
borderRadius:2
},
emptyText:{
paddingVertical:16,
paddingHorizontal:12,
textAlign:"center",
color:"#888888",
fontSize:15
}
});