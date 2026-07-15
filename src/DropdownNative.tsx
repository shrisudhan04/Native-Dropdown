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
    const leftImageSource = props.leftImage?.value as ImageSourcePropType;

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
            value={search}
            placeholder={props.placeholder || "Select"}
            onFocus={() => setOpen(true)}
            onChangeText={text => {
                setSearch(text);
                setOpen(true);
            }}
        />

        {arrowSource && (
            <TouchableOpacity
                onPress={() => setOpen(!open)}
                style={styles.arrowContainer}
            >
                <Image
                    source={arrowSource}
                    style={[
                        styles.arrow,
                        {
                            transform: [
                                {
                                    rotate: open ? "180deg" : "0deg"
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
const defaultStyles = StyleSheet.create({inputContainer: {
    width: "100%"
},
emptyText: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    textAlign: "center",
    fontSize: 15,
    color: "#888888"
},
item: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 12,
    minHeight: 48,
    backgroundColor: "#FFFFFF"
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
    width: 12,
    height: 12,
    borderRadius: 7,
    backgroundColor: "#212121"
},

itemText: {
    flex: 1,
    fontSize: 15,
    color: "#222222"
},
inputWrapper: {
    height: 45,
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 6,
    backgroundColor: "#FFF",
    flexDirection: "row",
    alignItems: "center"
},
    dropdown: {
    position: "absolute",
    top: 48,
    left: 0,
    right: 0,
    backgroundColor: "#FFF",
    borderWidth: 0,
    borderColor: "#CCC",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    overflow: "hidden",
    elevation: 50,
    zIndex: 99999,
    maxHeight: 300
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
    fontSize: 15,
    padding: 0
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
},});