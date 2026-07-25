{
    tasks.map((task, index) => ( <
        Task key = { index }
        task = { task }
        onDelete = {
            () => {
                const updated = tasks.filter((_, i) => i !== index)
                setTasks(updated)
            }
        }
        />
    ))
}