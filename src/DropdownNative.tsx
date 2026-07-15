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

type Option = {
    id: string;
    label: string;
};

export function DropdownNative(props: DropdownNativeProps<any>): ReactElement {
    const styles = mergeNativeStyles(defaultStyles, props.style);
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState<string[]>([]);

    const arrowSource = props.arrowImage?.value as ImageSourcePropType | undefined;
    const leftImageSource = props.leftImage?.value as ImageSourcePropType | undefined;

    const options = useMemo<Option[]>(() => {
    return String(props.options?.displayValue ?? "")
        .split(",")
        .map((item, index) => ({
            id: index.toString(),
            label: item.trim()
        }))
        .filter(item => item.label.length > 0);
}, [props.options?.displayValue]);
    useEffect(() => {
        const value = String(props.value?.displayValue ?? "");

        if (!value) {
            setSelected([]);
            setSearch("");
            return;
        }

        if (props.multiSelect) {
            setSelected(
                value
                    .split(",")
                    .map(item => item.trim())
                    .filter(item => item.length > 0)
            );
        } else {
            setSelected([value]);
            setSearch("");
        }
    }, [props.value?.displayValue, props.multiSelect]);

    const filteredOptions = useMemo(() => {
        const text = search.trim().toLowerCase();

        if (!text) {
            return options;
        }

        return options.filter(item =>
            item.label.toLowerCase().includes(text)
        );
    }, [search, options]);

    const updateValue = (values: string[]) => {
        setSelected(values);

        if (props.value?.setValue) {
            props.value.setValue(values.join(","));
        }
    };
    const selectItem = (item: Option) => {
        if (props.multiSelect) {
            let values: string[];

            if (selected.includes(item.label)) {
                values = selected.filter(value => value !== item.label);
            } else {
                values = [...selected, item.label];
            }

            updateValue(values);
        } else {
            updateValue([item.label]);
            setSearch("");
            setOpen(false);
        }

        if (props.onChange?.canExecute) {
            props.onChange.execute();
        }
    };

    const inputValue = useMemo(() => {
        if (open) {
            return search;
        }

        if (props.multiSelect) {
            return selected.join(", ");
        }

        return selected[0] ?? "";
    }, [open, search, selected, props.multiSelect]);

    return (
        <View style={styles.container}>
            {open && (
                <Pressable
                    style={styles.overlay}
                    onPress={() => {
                        setOpen(false);
                        setSearch("");
                    }}
                />
            )}

            <View style={styles.inputWrapper}>
                {leftImageSource && (
                    <Image
                        source={leftImageSource}
                        style={styles.leftImage}
                    />
                )}

                <TextInput
                    style={styles.input}
                    value={inputValue}
                    placeholder={props.placeholder || "Select"}
                    onFocus={() => {
                        setOpen(true);
                        setSearch("");
                    }}
                    onChangeText={text => {
                        setSearch(text);

                        if (!open) {
                            setOpen(true);
                        }
                    }}
                />

                {arrowSource && (
                    <TouchableOpacity
                        style={styles.arrowContainer}
                        activeOpacity={0.8}
                        onPress={() => {
                            const nextState = !open;

                            setOpen(nextState);

                            if (nextState) {
                                setSearch("");
                            }
                        }}
                    >
                        <Image
                            source={arrowSource}
                            style={[
                                styles.arrow,
                                {
                                    transform: [
                                        {
                                            rotate: open
                                                ? "180deg"
                                                : "0deg"
                                        }
                                    ]
                                }
                            ]}
                        />
                    </TouchableOpacity>
                )}
            </View>
                        {open && (
                <View style={styles.dropdown}>
                    <FlatList
                        data={filteredOptions}
                        keyExtractor={item => item.id}
                        keyboardShouldPersistTaps="always"
                        nestedScrollEnabled
                        showsVerticalScrollIndicator
                        renderItem={({ item }) => {
                            const isSelected = selected.includes(item.label);

                            return (
                                <TouchableOpacity
                                    style={styles.item}
                                    activeOpacity={0.7}
                                    onPress={() => selectItem(item)}
                                >
                                    {props.multiSelect ? (
                                        <View
                                            style={[
                                                styles.checkbox,
                                                isSelected &&
                                                    styles.checkboxSelected
                                            ]}
                                        >
                                            {isSelected && (
                                                <View
                                                    style={
                                                        styles.checkmark
                                                    }
                                                />
                                            )}
                                        </View>
                                    ) : (
                                        <View
                                            style={styles.radioOuter}
                                        >
                                            {isSelected && (
                                                <View
                                                    style={
                                                        styles.radioInner
                                                    }
                                                />
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
}const defaultStyles = StyleSheet.create({
    container: {
        width: "100%",
        position: "relative",
        zIndex: 1000,
        elevation: 20
    },
    overlay: {
        position: "absolute",
        top: -5000,
        bottom: -5000,
        left: -5000,
        right: -5000
    },
    inputWrapper: {
        width: "100%",
        height: 45,
        borderWidth: 1,
        borderColor: "#CCCCCC",
        borderRadius: 6,
        backgroundColor: "#FFFFFF",
        flexDirection: "row",
        alignItems: "center"
    },
    leftImage: {
        width: 20,
        height: 20,
        marginLeft: 12,
        marginRight: 8
    },
    input: {
        flex: 1,
        height: "100%",
        paddingHorizontal: 5,
        fontSize: 15,
        color: "#222222"
    },
    arrowContainer: {
        width: 45,
        height: "100%",
        justifyContent: "center",
        alignItems: "center"
    },
    arrow: {
        width: 20,
        height: 20
    },
    dropdown: {
        position: "absolute",
        top: 48,
        left: 0,
        right: 0,
        maxHeight: 300,
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#CCCCCC",
        borderRadius: 6,
        overflow: "hidden",
        elevation: 30,
        zIndex: 9999
    },
    item: {
        minHeight: 48,
        paddingHorizontal: 12,
        paddingVertical: 10,
        flexDirection: "row",
        alignItems: "center"
    },
    itemText: {
        flex: 1,
        fontSize: 15,
        color: "#222222"
    },
        radioOuter: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#222222",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12
    },
    radioInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: "#222222"
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 1,
        borderRadius: 3,
        borderColor: "#222222",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12
    },
    checkboxSelected: {
        backgroundColor: "#FFFFFF"
    },
    checkmark: {
        width: 12,
        height: 12,
        backgroundColor: "#222222",
        borderRadius: 2
    },
    emptyText: {
        padding: 16,
        textAlign: "center",
        color: "#888888",
        fontSize: 15
    }
});