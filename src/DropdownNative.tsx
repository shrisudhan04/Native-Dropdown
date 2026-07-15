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

export function DropdownNative(props: DropdownNativeProps<any>): ReactElement {
    const styles = mergeNativeStyles(defaultStyles, props.style);
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState(props.value.displayValue ?? "");
    const [selected, setSelected] = useState(props.value.displayValue ?? "");

    useEffect(() => {
        const value = props.value.displayValue ?? "";
        setSearch(value);
        setSelected(value);
    }, [props.value.displayValue]);

    const arrowSource = props.arrowImage?.value as ImageSourcePropType;

    const options = useMemo(() => {
        return (props.options ?? "")
            .split(",")
            .map(item => item.trim())
            .filter(item => item.length > 0);
    }, [props.options]);

    const filteredOptions = useMemo(() => {
        if (!search.trim()) {
            return options;
        }
        return options.filter(item =>
            item.toLowerCase().includes(search.toLowerCase())
        );
    }, [search, options]);

    const selectItem = (item: string) => {
        setSelected(item);
        setSearch(item);
        props.value.setValue(item);
        setOpen(false);
        if (props.onChange?.canExecute) {
            props.onChange.execute();
        }
    };

    return (
        <View style={styles.container}>
            {open && (
                <Pressable
                    style={styles.overlay}
                    onPress={() => setOpen(false)}
                />
            )}

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={search}
                    placeholder={props.placeholder || "Select"}
                    onFocus={() => setOpen(true)}
                    onChangeText={(text) => {
                        setSearch(text);
                        setOpen(true);
                    }}
                />

                {arrowSource && (
                    <Image
                        source={arrowSource}
                        style={styles.arrow}
                    />
                )}
            </View>

            {open && (
                <View style={styles.dropdown}>
                    <FlatList
                        data={filteredOptions}
                        keyExtractor={(item) => item}
                        keyboardShouldPersistTaps="handled"
                        nestedScrollEnabled={true}
                        showsVerticalScrollIndicator={true}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.item}
                                onPress={() => selectItem(item)}
                            >
                                <View style={styles.radioOuter}>
                                    {selected === item && (
                                        <View style={styles.radioInner} />
                                    )}
                                </View>

                                <Text style={styles.itemText}>
                                    {item}
                                </Text>
                            </TouchableOpacity>
                        )}
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

const defaultStyles = StyleSheet.create({
    container:{
        width:"100%",
        position:"relative",
        zIndex:999,
        elevation:999
    },
    inputContainer:{
        width:"100%",
        position:"relative"
    },
    input:{
        height:45,
        borderWidth:1,
        borderColor:"#CCC",
        borderRadius:6,
        paddingHorizontal:12,
        paddingRight:45,
        backgroundColor:"white"
    },
    arrow:{
        position:"absolute",
        right:12,
        top:12,
        width:20,
        height:20
    },
    dropdown:{
        position:"absolute",
        top:48,
        left:0,
        right:0,
        backgroundColor:"white",
        borderWidth:1,
        borderColor:"#CCC",
        borderRadius:6,
        elevation:20,
        maxHeight:300
    },
    overlay:{
        position:"absolute",
        top:-1000,
        left:-1000,
        right:-1000,
        bottom:-1000
    },
    item:{
        flexDirection:"row",
        alignItems:"center",
        padding:12
    },
    radioOuter:{
        width:18,
        height:18,
        borderRadius:9,
        borderWidth:2,
        borderColor:"#555",
        justifyContent:"center",
        alignItems:"center",
        marginRight:10
    },
    radioInner:{
        width:10,
        height:10,
        borderRadius:5,
        backgroundColor:"#555"
    },
    itemText:{
        fontSize:15
    },
    emptyText:{
        padding:12,
        color:"#888"
    }
});