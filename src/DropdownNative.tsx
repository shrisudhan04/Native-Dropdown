import { ReactElement, useMemo, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    TextInput
} from "react-native";

import { DropdownNativeProps } from "../typings/DropdownNativeProps";

export function DropdownNative(props: DropdownNativeProps<any>): ReactElement {

    const [open, setOpen] = useState(false);

    const [search, setSearch] = useState("");

    const options = useMemo(() => {

        if (!props.options) {
            return [];
        }

        return props.options
            .split(",")
            .map(item => item.trim())
            .filter(item => item.length > 0);

    }, [props.options]);

    const filteredOptions = useMemo(() => {

        if (search.trim() === "") {
            return options;
        }

        return options.filter(item =>
            item.toLowerCase().includes(search.toLowerCase())
        );

    }, [search, options]);

    const selectItem = (item: string): void => {

        props.value.setValue(item);

        if (props.onChange?.canExecute) {
            props.onChange.execute();
        }
        setOpen(false);
        setSearch("");
    };
    return (
        <View style={{
            position: "relative"
        }}>
            <TouchableOpacity
    onPress={() => setOpen(!open)}
    style={{
        height: 45,
        borderWidth: 1,
        borderColor: "#CCC",
        borderRadius: 6,
        paddingHorizontal: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    }}
>
                <Text>
                    {
                        props.value.displayValue ||
                        props.placeholder ||
                        "Select"
                    }
                </Text>
            </TouchableOpacity>
            {
    open &&

    <View
        style={{
            position: "absolute",
            top: 45,
            left: 0,
            right: 0,
            backgroundColor: "white",
            borderWidth: 1,
            borderColor: "#CCC",
            borderRadius: 6,
            zIndex: 9999,
            elevation: 20,
            maxHeight: 250
        }}
    >

        {
            props.searchEnabled &&

            <TextInput
                placeholder="Search..."
                value={search}
                onChangeText={setSearch}
                style={{
                    height: 40,
                    borderBottomWidth: 1,
                    borderBottomColor: "#DDD",
                    paddingHorizontal: 10
                }}
            />

        }

        <FlatList
            keyboardShouldPersistTaps="handled"
            data={filteredOptions}
            keyExtractor={item => item}
            renderItem={({ item }) => (

                <TouchableOpacity
                    style={{
                        padding: 12,
                        borderBottomWidth: 1,
                        borderBottomColor: "#EEE"
                    }}
                    onPress={() => selectItem(item)}
                >
                    <Text>{item}</Text>
                </TouchableOpacity>

            )}
        />

    </View>
}
           </View>);}