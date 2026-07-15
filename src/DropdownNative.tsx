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
    const [search, setSearch] = useState("");

    const [selected, setSelected] = useState<string[]>([]);

    useEffect(() => {
        const value = props.value.displayValue ?? "";

        if (props.multiSelect) {
            if (value.length > 0) {
                setSelected(
                    value
                        .split(",")
                        .map(v => v.trim())
                        .filter(v => v.length > 0)
                );
            } else {
                setSelected([]);
            }
        } else {
            if (value.length > 0) {
                setSelected([value]);
            } else {
                setSelected([]);
            }
        }
    }, [props.value.displayValue, props.multiSelect]);

    const arrowSource =
        props.arrowImage?.value as ImageSourcePropType;

    const leftImageSource =
        props.leftImage?.value as ImageSourcePropType;

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
            item
                .toLowerCase()
                .includes(search.toLowerCase())
        );
    }, [search, options]);

    const selectItem = (item: string) => {

        if (props.multiSelect) {

            let values: string[];

            if (selected.includes(item)) {
                values = selected.filter(v => v !== item);
            } else {
                values = [...selected, item];
            }

            setSelected(values);

            props.value.setValue(
                values.join(",")
            );

        } else {

            setSelected([item]);

            props.value.setValue(item);

            setSearch(item);

            setOpen(false);
        }

        if (props.onChange?.canExecute) {
            props.onChange.execute();
        }
    };

    return (
        <View style={styles.container}>

            {open && (
                <Pressable
                    style={styles.absoluteFill}
                    onPress={() => setOpen(false)}
                />
            )}
                        <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>

                    {leftImageSource && (
                        <Image
                            source={leftImageSource}
                            style={styles.leftImage}
                        />
                    )}

                    <TextInput
                        style={styles.input}
                        value={
                            props.multiSelect
                                ? (open ? search : selected.join(", "))
                                : (open ? search : (selected[0] ?? ""))
                        }
                        editable={open}
                        placeholder={props.placeholder || "Select"}
                        onFocus={() => {
                            setOpen(true);
                            setSearch("");
                        }}
                        onChangeText={text => {
                            setSearch(text);
                        }}
                    />

                    {arrowSource && (
                        <TouchableOpacity
                            style={styles.arrowContainer}
                            activeOpacity={0.8}
                            onPress={() => {
                                setOpen(!open);
                                if (!open) {
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
            </View>

            {open && (
                <View style={styles.dropdown}>
                    <FlatList
                        data={filteredOptions}
                        keyExtractor={item => item}
                        keyboardShouldPersistTaps="handled"
                        nestedScrollEnabled
                        showsVerticalScrollIndicator
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.item}
                                onPress={() => selectItem(item)}
                            >

                                {props.multiSelect ? (

                                    <View style={styles.checkBox}>
                                        {selected.includes(item) && (
                                            <View style={styles.checkMark} />
                                        )}
                                    </View>

                                ) : (

                                    <View style={styles.radioOuter}>
                                        {selected.includes(item) && (
                                            <View style={styles.radioInner} />
                                        )}
                                    </View>

                                )}

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
    container: {
    width: "100%",
    position: "relative",
    zIndex: 999,
    elevation: 999
},
absoluteFill: {
    position: "absolute",
    top: -1000,
    left: -1000,
    right: -1000,
    bottom: -1000
},
inputContainer: {
    width: "100%"
},
inputWrapper: {
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
    padding: 0,
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
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    overflow: "hidden",
    elevation: 20,
    zIndex: 99999,
    maxHeight: 300
},
item: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 48,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF"
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
    borderColor: "#212121",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12
},
radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#212121"
},
checkBox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderRadius: 3,
    borderColor: "#212121",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    backgroundColor: "#FFFFFF"
},
checkMark: {
    width: 12,
    height: 12,
    backgroundColor: "#212121",
    borderRadius: 2
},
emptyText: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    textAlign: "center",
    color: "#888888",
    fontSize: 15
}
});