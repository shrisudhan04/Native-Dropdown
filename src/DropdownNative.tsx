import { ReactElement, useMemo, useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Pressable } from "react-native";
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

    const options = useMemo(() => {
        const value = props.options?.value ?? "";
        return value.split(",").map(item => item.trim()).filter(item => item.length > 0);
    }, [props.options?.value]);

    const filteredOptions = useMemo(() => {
        if (!search.trim()) {
            return options;
        }
        return options.filter(item => item.toLowerCase().includes(search.toLowerCase()));
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
            <TextInput
                style={styles.input}
                value={search}
                placeholder={props.placeholder || "Select"}
                onFocus={() => setOpen(true)}
                onChangeText={(text) => {
                    setSearch(text);
                    setOpen(true);
                }}
                returnKeyType="done"
                onSubmitEditing={() => setOpen(false)}
            />
            {open && (
                <View style={styles.dropdown}>
                    <FlatList
                        style={filteredOptions.length > 4 ? { maxHeight: 300 } : undefined}
                        keyboardShouldPersistTaps="handled"
                        nestedScrollEnabled={true}
                        data={filteredOptions}
                        keyExtractor={item => item}
                        showsVerticalScrollIndicator={true}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.item}
                                onPress={() => selectItem(item)}
                            >
                                <View style={styles.radioOuter}>
                                    {selected === item && <View style={styles.radioInner} />}
                                </View>
                                <Text style={styles.itemText}>{item}</Text>
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
    container: {
        width: "100%",
        position: "relative",
        zIndex: 999,
        elevation: 999
    },
    input: {
        height: 45,
        borderWidth: 1,
        borderColor: "#CCC",
        borderRadius: 6,
        paddingHorizontal: 12,
        backgroundColor: "white"
    },
    dropdown: {
        position: "absolute",
        top: 48,
        left: 0,
        right: 0,
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: "#CCC",
        borderRadius: 6,
        zIndex: 9999,
        elevation: 20
    },
    overlay: {
        position: "absolute",
        top: -1000,
        left: -1000,
        right: -1000,
        bottom: -1000,
        zIndex: -1
    },
    item: {
        flexDirection: "row",
        alignItems: "center",
        padding: 12
    },
    radioOuter: {
        width: 18,
        height: 18,
        borderRadius: 9,
        borderWidth: 2,
        borderColor: "#555",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10
    },
    radioInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: "#555"
    },
    itemText: {
        fontSize: 15
    },
    emptyText: {
        padding: 12,
        color: "#888"
    }
});