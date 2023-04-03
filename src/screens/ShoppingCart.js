import { FlatList, StyleSheet, Text, View, Pressable, ActivityIndicator, Alert } from 'react-native'
import React from 'react'
import CartListItem from '../components/CartListItem';
import { useSelector } from 'react-redux';
import { selectSubTotal, selectToatlPrice, selectDeliveryPrice } from '../store/cartSlice';
import { useCreateOrderMutation } from '../store/apiSlice';

const shoppingCartTotals = () => {
    const subtoatl = useSelector(selectSubTotal);
    const deliveryFees = useSelector(selectDeliveryPrice);
    const total = useSelector(selectToatlPrice)
    return (
        <View style={styles.totalsContainer}>
            <View style={styles.row}>
                <Text style={styles.text}>Subtotal</Text>
                <Text style={styles.text}>{subtoatl}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.text}>Delivery</Text>
                <Text style={styles.text}>{deliveryFees}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.textBold}>Total</Text>
                <Text style={styles.textBold}>{total}</Text>
            </View>
        </View>
    )
};


const ShoppingCart = () => {
    const subtoatl = useSelector(selectSubTotal);
    const deliveryFees = useSelector(selectDeliveryPrice);
    const total = useSelector(selectToatlPrice)
    const cartItems = useSelector((state) => state.cart.items);

    const [createOrder, {data, error, isLoading}] = useCreateOrderMutation();

    const onCreateOrder = async() =>{
        const result = await createOrder({
            items :cartItems,
            subtoatl,
            deliveryFees,
            total,
            customer:{
                name:'Ajay Raj Tiwari',
                address:'Indore',
                email:'ajay@gmail.com'
            }
        })
        if(result.data?.status === 'OK'){
            Alert.alert(
                'Order has been submitted',
                `Your order reference no is: ${result.data.data.ref}`
            )
        }
    }

    return (
        <>
            <FlatList
                data={cartItems}
                renderItem={({ item }) => <CartListItem cartItem={item} />}
                ListFooterComponent={shoppingCartTotals}
            />
            <Pressable style={styles.button} onPress={onCreateOrder} >
                <Text style={styles.buttonText}>Checkout {isLoading && <ActivityIndicator/>} </Text>
            </Pressable>
        </>
    )
}

export default ShoppingCart

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    totalsContainer: {
        margin: 20,
        paddingTop: 10,
        borderTopWidth: 1,
        borderColor: 'gainsboro'
    },
    text: {
        fontSize: 16,
        color: 'gray'
    },
    textBold: {
        fontSize: 16,
        fontWeight: '500'
    },
    button: {
        position: 'absolute',
        backgroundColor: 'black',
        bottom: 30,
        width: '90%',
        alignSelf: 'center',
        padding: 20,
        borderRadius: 100,
        alignItems: 'center'
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500'
    }
})