<template>
    <GridLayout rows="30, auto" marginBottom="5">
        <Label class="label" row="0" ref="label" :text="placeholder" :name="label" />
        <TextField row="1" ref="textField" :secure="secure"  borderBottomWidth="3" @textChange="onTextChange"
            borderBottomColor="#fff" padding="0" :text="valeur" marginLeft="10"/>
    </GridLayout>
</template>

<script>
    //const applicationSettings = require('./components/tns-core-modules/application-settings') 
        
    import {
        Color
    } from "color";
    export default {
        props: {
            placeholder: {
                type: String
            },
            secure: {
                type: String
            },
            label: {
                type: String
            },
			valeur: {
				type: String
			}
        },
		mounted() {
			
		},
        methods: {
			onTextChange: function() {
                const textField = this.$refs.textField.nativeView;
				this.$emit("updateValeur",textField.text);
            },
            
        }
    };
</script>

<style>
</style>