
const run = async () => {
    console.log('-== Waiting for db ==-');
    await new Promise((resolve) => {
        setTimeout(resolve, 4000);
    });

    console.log('-== Finished wainting ==-');
};
run();