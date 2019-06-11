<template>
    <Page>
      <ActionBar title="Detail"/>
      <StackLayout>
        <Label :text="textModal" />
        <Button @tap="$modal.close(false)" text="Annuler" />
        <Button @tap="$modal.close(true)" text="Valider" />
      </StackLayout>
    </Page>
</template>

<script>
	
    export default {
        data() {
            return {
                
            };
        },
        props: ['textModal'],
        
		methods: {},
		components: {},
    };
</script>


<style>
</style>