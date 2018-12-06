function ToDoItem(item, category, isEditing = false, isComplete = false) { 
    var self = this;
    self.item = ko.observable(item);
    self.category = ko.observable(category);
    self.isComplete = ko.observable(isEditing);
    self.isEditing = ko.observable(isComplete);
    self.tempItem = ko.observable('');
    self.tempCategory = ko.observable('');
}

function ViewModel() {
    var self = this;

    self.categories = [
        'All',
        'Work',
        'School',
        'Household',
        'Personal',
        'Other'
    ]
	self.hideCompleted = ko.observable(false);
    self.ToDoList = ko.observableArray([]);
    self.selectedCategory = ko.observable('All');
    self.filteredItems = ko.computed(function () {
		//if selected category is all and hide complete is true,
        // map items 
		if ( self.selectedCategory() === 'All' && !self.hideCompleted() ) {
			console.log('yes');
			return self.ToDoList().map(item => item)
		} else

        // if selected category is All and hide complete is true,
        // filter to do list for items that are not complete
        if (self.selectedCategory() === 'All' && self.hideCompleted() ) {
			console.log('category: all, hidecomplete: true')
			return self.ToDoList().filter(item => !item.isComplete())
		} else 
		
		// if selected category is NOT all and hide complete is true
		if ( self.hideCompleted() ) {
			return self.ToDoList().filter(item => item.category() === self.selectedCategory() && !item.isComplete());
		} else {

        // if slected category is NOT all and hide complete is false
        // filter to do list for items that match the selected category
			return self.ToDoList().filter(item => item.category() === self.selectedCategory());
		} 
	})
    
    self.editMode = ko.computed(function () {
        if (self.ToDoList().filter(item => item.isEditing()).length > 0) {
            return true;
        } else {
            return false;
        }
    });

	self.completedItems = ko.computed(function() {
		return self.filteredItems().filter(item => item.isComplete()).length
	})
   
    self.title = `Susie's Awesome To Do List`
   

    self.addRow = () => {
        self.ToDoList.push(new ToDoItem('', self.selectedCategory(), false, true));
    }

       

    self.removeItem = function (item) {
        if (confirm("are you sure you wanna delete this item?")) {
            self.ToDoList.remove(item)
        }
    }

    self.editItem = function (item) {
        item.isEditing(true);
    }

    self.confirmEdit = function (item) {
        if (item.tempItem().length === 0 && item.tempCategory().length === 0) {
            alert('please enter an item and category');
        } else if (item.tempItem().length === 0) {
            alert('please enter an item');
        } else if (item.tempCategory().length === 0) {
            alert('please choose a category');
        } else {
            item.isEditing(false);
            item.item(item.tempItem());
            item.category(item.tempCategory());
        }
    }

    self.cancelEdit = function (item) {
        if (item.tempItem().length === 0 || item.tempCategory().length === 0) {
            self.ToDoList.remove(item);
        } else {
            item.isEditing(false);
            item.tempItem(item.item());
            item.tempCategory(item.category());
        }
    }

    self.markAsDone = function (item) {
        if (item.isComplete()) {
            item.isComplete(false);
        } else {
            item.isComplete(true);
        }
    }
}


ko.applyBindings(new ViewModel());

