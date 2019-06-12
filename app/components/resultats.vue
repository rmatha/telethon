<template>
    <page class="page" actionBarHidden="true">
	<GridLayout rows="auto, *, auto" columns="*, *, *">
			<Header row="0" col="0" colSpan="3"/>
			<StackLayout row="1" col="0" colSpan="3" width="100%" height="100%">
				<ScrollView>
					<StackLayout class="m-20">
						<StackLayout orientation="horizontal" backgroundcolor="#562389">
						<Label text="Resultats!" />
						</StackLayout>
						
					</StackLayout>
				</ScrollView>
				
			</StackLayout>
			<Footer row="2" col="0" colSpan="3"/>
		</GridLayout>
	</page>
</template>

<script>
export default {
    data() {
	    return {
	    };
    }
}
</script>

<style>
</style>