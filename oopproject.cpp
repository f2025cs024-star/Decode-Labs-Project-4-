#include <iostream>
#include <fstream>
#include <vector>
#include <string>
#include <sstream>
using namespace std;
// This is an abstract base class that demonstrates Abstraction.
// It hides the complex analysis logic and only provides a simple interface for the user.
class AIAnalyzer {
public:
    // Pure virtual function that must be overridden by child classes
    virtual void analyzePrompt() const = 0; 
    
    // Virtual destructor is important when using polymorphism to delete objects safely
    virtual ~AIAnalyzer() {} 
};
// This class stores old versions of a prompt, showing what the prompt looked like before.
class PromptHistory {
private:
    string oldContent; // The text of the old version
    string editTimestamp; // When the edit happened
public:
    // Constructor to set up the history entry
    PromptHistory(string content, string timestamp) {
        oldContent = content;
        editTimestamp = timestamp;
    }
    // Getter to retrieve the old text safely
    string getOldContent() const { 
        return oldContent; 
    }
    // Getter to retrieve the time of edit safely
    string getEditTimestamp() const { 
        return editTimestamp; 
    }
};
// This is the base class for all prompts. It demonstrates Encapsulation and Inheritance.
class Prompt : public AIAnalyzer {
private:
    // All data members are private to protect the data (Encapsulation)
    string title;
    string content;
    string category;
    int rating;
    bool isFavorite;
    vector<PromptHistory> history; // A list to keep track of old versions
public:
    // Constructor initializes a new prompt with the given values
    Prompt(string t, string c, string cat, int r = 0, bool fav = false) {
        title = t;
        content = c;
        category = cat;
        setRating(r); // Use the setter to apply validation
        isFavorite = fav;
    }
    // Getters to allow reading the private data without modifying it
    string getTitle() const { return title; }
    string getContent() const { return content; }
    string getCategory() const { return category; }
    int getRating() const { return rating; }
    bool getIsFavorite() const { return isFavorite; }
    vector<PromptHistory> getHistory() const { return history; }
    // Setters to allow changing the private data safely
    void setTitle(string t) { title = t; }
    
    // This setter saves the old content to history before updating the new content
    void setContent(string c, string date) { 
        if (content != "") {
            history.push_back(PromptHistory(content, date));
        }
        content = c; 
    }
    
    void setCategory(string cat) { category = cat; }
    
    // This setter validates the input to make sure the rating is between 1 and 5
    void setRating(int r) {
        if (r >= 1 && r <= 5) {
            rating = r;
        } else if (r == 0) {
            rating = 0; // 0 means unrated
        } else {
            cout << "Invalid rating. Must be between 1 and 5." << endl;
            rating = 0; // default to unrated on error
        }
    }
    
    void setIsFavorite(bool fav) { isFavorite = fav; }
    // This function switches the favorite status from true to false or vice versa
    void toggleFavorite() { 
        isFavorite = !isFavorite; 
    }
    // This function calculates how many times the prompt was edited
    int getEditCount() const { 
        return history.size(); 
    }
    // This function calculates a productivity score based on rating and edits
    int getProductivityScore() const {
        return (rating * 2) + getEditCount();
    }
    
    // This function counts how many words are in the prompt's content
    int getWordCount() const {
        int count = 0;
        stringstream ss(content);
        string word;
        // Read word by word until the end of the string
        while (ss >> word) {
            count++;
        }
        return count;
    }
    // This function adds an entry to history directly, used mainly when loading from a file
    void addHistoryManual(string oldContent, string date) {
        history.push_back(PromptHistory(oldContent, date));
    }
    // Virtual destructor for safety with Inheritance
    virtual ~Prompt() {}
};
// This child class inherits from Prompt and adds a specific feature for Coding.
class CodingPrompt : public Prompt {
private:
    string programmingLanguage; // Specific data member for this category
public:
    // Constructor calls the base class constructor first, then sets its own data
    CodingPrompt(string t, string c, string lang, int r = 0, bool fav = false) 
        : Prompt(t, c, "Coding", r, fav) {
        programmingLanguage = lang;
    }
    // Getter for the programming language
    string getProgrammingLanguage() const { return programmingLanguage; }
    // Overriding the pure virtual function from AIAnalyzer (Polymorphism)
    void analyzePrompt() const override {
        cout << "[Analysis] Coding Prompt: Make sure to mention the exact " 
             << programmingLanguage << " version and what the output should look like." << endl;
    }
};
// This child class inherits from Prompt and adds a specific feature for Writing.
class WritingPrompt : public Prompt {
private:
    string writingStyle; // e.g., formal, creative
public:
    WritingPrompt(string t, string c, string style, int r = 0, bool fav = false) 
        : Prompt(t, c, "Writing", r, fav) {
        writingStyle = style;
    }
    string getWritingStyle() const { return writingStyle; }
    void analyzePrompt() const override {
        cout << "[Analysis] Writing Prompt: For a " << writingStyle 
             << " tone, check if the vocabulary matches your target audience." << endl;
    }
};
// This child class inherits from Prompt and adds a specific feature for Research.
class ResearchPrompt : public Prompt {
private:
    string researchField; // e.g., science, history
public:
    ResearchPrompt(string t, string c, string field, int r = 0, bool fav = false) 
        : Prompt(t, c, "Research", r, fav) {
        researchField = field;
    }
    string getResearchField() const { return researchField; }
    void analyzePrompt() const override {
        cout << "[Analysis] Research Prompt: In the field of " << researchField 
             << ", ask the AI to cite sources or use peer-reviewed data." << endl;
    }
};
// This child class inherits from Prompt and adds a specific feature for Images.
class ImagePrompt : public Prompt {
private:
    string imageStyle; // e.g., realistic, cartoon
public:
    ImagePrompt(string t, string c, string style, int r = 0, bool fav = false) 
        : Prompt(t, c, "Image", r, fav) {
        imageStyle = style;
    }
    string getImageStyle() const { return imageStyle; }
    void analyzePrompt() const override {
        cout << "[Analysis] Image Prompt: To generate a great " << imageStyle 
             << " image, describe the lighting and colors clearly." << endl;
    }
};
// This class handles saving and loading all prompts to/from a text file
class FileManager {
public:
    // This function saves all prompts to a file so they are not lost when the program closes
    static void savePrompts(const vector<Prompt*>& prompts) {
        ofstream file("prompts.txt");
        if (!file.is_open()) {
            cout << "Error: Could not open file for saving." << endl;
            return;
        }
        // We use a loop here to go through every prompt one by one
        for (int i = 0; i < prompts.size(); i++) {
            Prompt* p = prompts[i];
            
            // We need to know which child class it is to save specific fields safely
            string specificField = "None";
            if (p->getCategory() == "Coding") {
                // Cast the base pointer to the child pointer to get the specific field
                specificField = ((CodingPrompt*)p)->getProgrammingLanguage();
            } else if (p->getCategory() == "Writing") {
                specificField = ((WritingPrompt*)p)->getWritingStyle();
            } else if (p->getCategory() == "Research") {
                specificField = ((ResearchPrompt*)p)->getResearchField();
            } else if (p->getCategory() == "Image") {
                specificField = ((ImagePrompt*)p)->getImageStyle();
            }
            // Write all data separated by the | symbol
            file << p->getCategory() << "|"
                 << p->getTitle() << "|"
                 << p->getContent() << "|"
                 << p->getRating() << "|"
                 << (p->getIsFavorite() ? "1" : "0") << "|"
                 << specificField << "|";
            // Save history for this prompt
            vector<PromptHistory> hist = p->getHistory();
            file << hist.size(); // First save how many history items there are
            
            for (int j = 0; j < hist.size(); j++) {
                file << "|" << hist[j].getOldContent() << "|" << hist[j].getEditTimestamp();
            }
            file << "\n"; // Move to the next line for the next prompt
        }
        file.close();
    }
    // This function loads prompts from the file when the program starts
    static void loadPrompts(vector<Prompt*>& prompts) {
        ifstream file("prompts.txt");
        if (!file.is_open()) {
            // It is okay if the file does not exist yet (like on the very first run)
            return; 
        }
        string line;
        // Read the file line by line
        while (getline(file, line)) {
            if (line.empty()) continue;
            stringstream ss(line);
            string category, title, content, ratingStr, favStr, specificField, histCountStr;
            // Extract each piece of data using the | separator
            getline(ss, category, '|');
            getline(ss, title, '|');
            getline(ss, content, '|');
            getline(ss, ratingStr, '|');
            getline(ss, favStr, '|');
            getline(ss, specificField, '|');
            getline(ss, histCountStr, '|');
            // Convert string to integer safely
            int rating = 0;
            if (ratingStr != "") {
                stringstream parser(ratingStr);
                parser >> rating;
            }
            // Convert string to boolean
            bool isFav = false;
            if (favStr == "1") {
                isFav = true;
            }
            Prompt* p = nullptr;
            
            // Recreate the correct child object based on the category
            if (category == "Coding") {
                p = new CodingPrompt(title, content, specificField, rating, isFav);
            } else if (category == "Writing") {
                p = new WritingPrompt(title, content, specificField, rating, isFav);
            } else if (category == "Research") {
                p = new ResearchPrompt(title, content, specificField, rating, isFav);
            } else if (category == "Image") {
                p = new ImagePrompt(title, content, specificField, rating, isFav);
            }
            if (p != nullptr) {
                int histCount = 0;
                if (histCountStr != "") {
                    stringstream parser(histCountStr);
                    parser >> histCount;
                }
                
                // Read and add the history back
                for (int i = 0; i < histCount; i++) {
                    string hContent, hDate;
                    getline(ss, hContent, '|');
                    getline(ss, hDate, '|');
                    p->addHistoryManual(hContent, hDate);
                }
                // Add the newly recreated prompt to our main list
                prompts.push_back(p);
            }
        }
        file.close();
    }
};
// This class calculates and displays different statistics about the prompts
class Statistics {
public:
    // This function takes all the prompts and analyzes their data
    static void displayDashboard(const vector<Prompt*>& prompts) {
        if (prompts.empty()) {
            cout << "No prompts available for statistics." << endl;
            return;
        }
        int total = prompts.size();
        double sumRating = 0.0;
        int ratedCount = 0;
        
        int catCoding = 0;
        int catWriting = 0;
        int catResearch = 0;
        int catImage = 0;
        
        Prompt* bestPrompt = nullptr;
        // Loop through all prompts to gather data
        for (int i = 0; i < prompts.size(); i++) {
            Prompt* p = prompts[i];
            
            // Check ratings
            if (p->getRating() > 0) {
                sumRating += p->getRating();
                ratedCount++;
                
                // Find the highest rated prompt
                if (bestPrompt == nullptr || p->getRating() > bestPrompt->getRating()) {
                    bestPrompt = p;
                }
            }
            // Count the categories
            string cat = p->getCategory();
            if (cat == "Coding") catCoding++;
            else if (cat == "Writing") catWriting++;
            else if (cat == "Research") catResearch++;
            else if (cat == "Image") catImage++;
        }
        // Calculate average rating safely to avoid dividing by zero
        double avgRating = 0.0;
        if (ratedCount > 0) {
            avgRating = sumRating / ratedCount;
        }
        // Figure out the most used category
        string mostUsedCat = "None";
        int maxCat = 0;
        if (catCoding > maxCat) { maxCat = catCoding; mostUsedCat = "Coding"; }
        if (catWriting > maxCat) { maxCat = catWriting; mostUsedCat = "Writing"; }
        if (catResearch > maxCat) { maxCat = catResearch; mostUsedCat = "Research"; }
        if (catImage > maxCat) { maxCat = catImage; mostUsedCat = "Image"; }
        // Display everything clearly
        cout << "\n=== Statistics Dashboard ===" << endl;
        cout << "Total Prompts: " << total << endl;
        cout << "Average Rating: " << avgRating << endl;
        
        cout << "Count per category: " << endl;
        cout << " - Coding: " << catCoding << endl;
        cout << " - Writing: " << catWriting << endl;
        cout << " - Research: " << catResearch << endl;
        cout << " - Image: " << catImage << endl;
        
        cout << "Most Used Category: " << mostUsedCat << " (" << maxCat << " prompts)" << endl;
        
        if (bestPrompt != nullptr) {
            cout << "Highest-Rated Prompt: " << bestPrompt->getTitle() 
                 << " (Rating: " << bestPrompt->getRating() << ")" << endl;
        } else {
            cout << "Highest-Rated Prompt: None" << endl;
        }
        cout << "============================" << endl;
    }
};
// This class acts as the main controller, managing the collection of all prompts
class PromptManager {
private:
    vector<Prompt*> prompts; // A list of pointers to Prompt objects
    // Helper function to print a single prompt nicely
    void displaySinglePrompt(Prompt* p) {
        cout << "Title: " << p->getTitle() << endl;
        cout << "Category: " << p->getCategory() << endl;
        
        // Use Polymorphism! This calls the correct analyzePrompt() based on the actual object type
        p->analyzePrompt();
        
        cout << "Content: " << p->getContent() << endl;
        
        // Convert rating to string for clean display
        if (p->getRating() == 0) {
            cout << "Rating: Unrated" << endl;
        } else {
            cout << "Rating: " << p->getRating() << endl;
        }
        
        cout << "Favorite: " << (p->getIsFavorite() ? "Yes" : "No") << endl;
        cout << "Productivity Score: " << p->getProductivityScore() << endl;
        
        // Smart Recommendation Engine
        int words = p->getWordCount();
        int rating = p->getRating();
        if (words > 50) {
            cout << "Tip: Your prompt is quite long. Try making it shorter and more specific." << endl;
        } else if (rating > 0 && rating <= 3) {
            cout << "Tip: This prompt has a low rating. Try being more clear about what you want." << endl;
        } else if (rating == 5) {
            cout << "Great prompt! This one is working well for you." << endl;
        }
    }
public:
    // Destructor to free up the memory we used when creating prompts
    ~PromptManager() {
        for (int i = 0; i < prompts.size(); i++) {
            delete prompts[i];
        }
    }
    // This function tells the FileManager to load prompts from the file
    void loadFromFile() {
        FileManager::loadPrompts(prompts);
    }
    // This function tells the FileManager to save prompts to the file
    void saveToFile() {
        FileManager::savePrompts(prompts);
    }
    // Feature 1: Create a new prompt based on user input
    void createNewPrompt() {
        cout << "\n--- Create New Prompt ---" << endl;
        string title, content, specific;
        int categoryChoice;
        cin.ignore(); // Clear the input buffer
        cout << "Enter title: ";
        getline(cin, title);
        cout << "Enter content: ";
        getline(cin, content);
        cout << "Select Category (1. Coding, 2. Writing, 3. Research, 4. Image): ";
        cin >> categoryChoice;
        cin.ignore(); // Clear the newline left by cin
        Prompt* newPrompt = nullptr;
        // Create the correct child class depending on what the user chose
        if (categoryChoice == 1) {
            cout << "Enter programming language: ";
            getline(cin, specific);
            newPrompt = new CodingPrompt(title, content, specific);
        } else if (categoryChoice == 2) {
            cout << "Enter writing style: ";
            getline(cin, specific);
            newPrompt = new WritingPrompt(title, content, specific);
        } else if (categoryChoice == 3) {
            cout << "Enter research field: ";
            getline(cin, specific);
            newPrompt = new ResearchPrompt(title, content, specific);
        } else if (categoryChoice == 4) {
            cout << "Enter image style: ";
            getline(cin, specific);
            newPrompt = new ImagePrompt(title, content, specific);
        } else {
            cout << "Invalid category. Creating default Writing prompt." << endl;
            newPrompt = new WritingPrompt(title, content, "General");
        }
        prompts.push_back(newPrompt); // Add it to our list
        cout << "Prompt created successfully!" << endl;
    }
    // Feature 2: Show all prompts on the screen
    void viewAllPrompts() {
        cout << "\n--- All Prompts ---" << endl;
        if (prompts.empty()) {
            cout << "No prompts found." << endl;
            return;
        }
        // Loop through and display each one
        for (int i = 0; i < prompts.size(); i++) {
            cout << "\n[" << i + 1 << "] ";
            displaySinglePrompt(prompts[i]);
            cout << "------------------------" << endl;
        }
    }
    // Feature 3: Let the user rate a prompt
    void ratePrompt() {
        cout << "\n--- Rate a Prompt ---" << endl;
        if (prompts.empty()) {
            cout << "No prompts available." << endl;
            return;
        }
        for (int i = 0; i < prompts.size(); i++) {
            cout << i + 1 << ". " << prompts[i]->getTitle() 
                 << " (Current Rating: " << prompts[i]->getRating() << ")" << endl;
        }
        cout << "Enter the number of the prompt to rate (0 to cancel): ";
        int choice;
        cin >> choice;
        // Make sure the choice is valid
        if (choice > 0 && choice <= prompts.size()) {
            cout << "Enter new rating (1-5): ";
            int rating;
            cin >> rating;
            prompts[choice - 1]->setRating(rating); // This calls the validated setter
            cout << "Rating updated." << endl;
        }
    }
    // Feature 4: Search for a specific word in titles and content
    void searchPrompts() {
        cout << "\n--- Search Prompts ---" << endl;
        cout << "Enter keyword: ";
        string keyword;
        cin.ignore(); // Clear buffer
        getline(cin, keyword);
        bool found = false;
        // Loop through all prompts to see if the keyword is there
        for (int i = 0; i < prompts.size(); i++) {
            string title = prompts[i]->getTitle();
            string content = prompts[i]->getContent();
            
            // Check if the keyword is inside the title or the content
            if (title.find(keyword) != string::npos || content.find(keyword) != string::npos) {
                cout << "\nMatch found at Index [" << i + 1 << "]:" << endl;
                displaySinglePrompt(prompts[i]);
                found = true;
            }
        }
        if (!found) {
            cout << "No prompts matched your keyword." << endl;
        }
    }
    // Feature 5: Turn favorite status on or off
    void toggleFavorite() {
        cout << "\n--- Mark/Unmark Favorite ---" << endl;
        for (int i = 0; i < prompts.size(); i++) {
            cout << i + 1 << ". " << prompts[i]->getTitle() 
                 << " (Favorite: " << (prompts[i]->getIsFavorite() ? "Yes" : "No") << ")" << endl;
        }
        cout << "Enter prompt number (0 to cancel): ";
        int choice;
        cin >> choice;
        if (choice > 0 && choice <= prompts.size()) {
            prompts[choice - 1]->toggleFavorite();
            cout << "Favorite status updated." << endl;
        }
    }
    // Feature 6: Show only the prompts marked as favorite
    void viewFavorites() {
        cout << "\n--- Favorite Prompts ---" << endl;
        bool found = false;
        for (int i = 0; i < prompts.size(); i++) {
            if (prompts[i]->getIsFavorite()) {
                cout << "\n[" << i + 1 << "] ";
                displaySinglePrompt(prompts[i]);
                found = true;
            }
        }
        if (!found) {
            cout << "No favorite prompts yet." << endl;
        }
    }
    // Feature 7: Change the content of a prompt and save the old version
    void editPrompt() {
        cout << "\n--- Edit a Prompt ---" << endl;
        for (int i = 0; i < prompts.size(); i++) {
            cout << i + 1 << ". " << prompts[i]->getTitle() << endl;
        }
        cout << "Enter prompt number to edit (0 to cancel): ";
        int choice;
        cin >> choice;
        if (choice > 0 && choice <= prompts.size()) {
            cout << "Current Content: " << prompts[choice - 1]->getContent() << endl;
            cout << "Enter new content: ";
            cin.ignore();
            string newContent;
            getline(cin, newContent);
            
            // The setter automatically takes care of saving the old content to history!
            prompts[choice - 1]->setContent(newContent, "Edited manually by user");
            cout << "Prompt updated. Old version saved to history." << endl;
        }
    }
    // Feature 8: Look at the old versions of a specific prompt
    void viewHistory() {
        cout << "\n--- View Prompt History ---" << endl;
        for (int i = 0; i < prompts.size(); i++) {
            cout << i + 1 << ". " << prompts[i]->getTitle() << endl;
        }
        cout << "Enter prompt number (0 to cancel): ";
        int choice;
        cin >> choice;
        if (choice > 0 && choice <= prompts.size()) {
            vector<PromptHistory> hist = prompts[choice - 1]->getHistory();
            if (hist.empty()) {
                cout << "No history available for this prompt. It has never been edited." << endl;
            } else {
                for (int j = 0; j < hist.size(); j++) {
                    cout << "\nVersion " << j + 1 << ":" << endl;
                    cout << "Date: " << hist[j].getEditTimestamp() << endl;
                    cout << "Content: " << hist[j].getOldContent() << endl;
                }
            }
        }
    }
    // Feature 9: Show two prompts next to each other to compare them
    void comparePrompts() {
        cout << "\n--- Compare Two Prompts ---" << endl;
        if (prompts.size() < 2) {
            cout << "You need at least 2 prompts to compare." << endl;
            return;
        }
        for (int i = 0; i < prompts.size(); i++) {
            cout << i + 1 << ". " << prompts[i]->getTitle() << endl;
        }
        
        cout << "Enter first prompt number: ";
        int choice1;
        cin >> choice1;
        
        cout << "Enter second prompt number: ";
        int choice2;
        cin >> choice2;
        if (choice1 > 0 && choice1 <= prompts.size() && choice2 > 0 && choice2 <= prompts.size()) {
            Prompt* p1 = prompts[choice1 - 1];
            Prompt* p2 = prompts[choice2 - 1];
            // Print them clearly so the student can compare
            cout << "\n=== Comparison ===" << endl;
            
            cout << "[Prompt 1]" << endl;
            cout << "Title: " << p1->getTitle() << endl;
            cout << "Category: " << p1->getCategory() << endl;
            cout << "Rating: " << p1->getRating() << endl;
            cout << "Productivity Score: " << p1->getProductivityScore() << endl;
            cout << "Content: " << p1->getContent() << endl;
            
            cout << "\n[Prompt 2]" << endl;
            cout << "Title: " << p2->getTitle() << endl;
            cout << "Category: " << p2->getCategory() << endl;
            cout << "Rating: " << p2->getRating() << endl;
            cout << "Productivity Score: " << p2->getProductivityScore() << endl;
            cout << "Content: " << p2->getContent() << endl;
        } else {
            cout << "Invalid selections." << endl;
        }
    }
    // Feature 10: Print out the statistics dashboard using the Statistics class
    void displayStatistics() {
        Statistics::displayDashboard(prompts);
    }
    // Feature 11: Find prompts that have a very low rating
    void effectivenessAnalysis() {
        cout << "\n=== Effectiveness Analysis ===" << endl;
        bool found = false;
        for (int i = 0; i < prompts.size(); i++) {
            int rating = prompts[i]->getRating();
            // A rating of 0 means unrated, so we only look at ratings 1 and 2
            if (rating > 0 && rating <= 2) {
                cout << "- [" << prompts[i]->getTitle() << "] Rating: " << rating << " -> Needs Improvement!" << endl;
                found = true;
            }
        }
        if (!found) {
            cout << "Great job! No prompts need improvement." << endl;
        }
        cout << "==============================" << endl;
    }
    // Feature 12: Remove a prompt from the list
    void deletePrompt() {
        cout << "\n--- Delete a Prompt ---" << endl;
        if (prompts.empty()) {
            cout << "No prompts available to delete." << endl;
            return;
        }
        for (int i = 0; i < prompts.size(); i++) {
            cout << i + 1 << ". " << prompts[i]->getTitle() << endl;
        }
        cout << "Enter the number of the prompt to delete (0 to cancel): ";
        int choice;
        cin >> choice;
        if (choice > 0 && choice <= prompts.size()) {
            // Delete the memory first to avoid a memory leak
            delete prompts[choice - 1]; 
            // Then remove the empty pointer from the vector
            prompts.erase(prompts.begin() + choice - 1); 
            cout << "Prompt deleted successfully." << endl;
        }
    }
};
// The main function where the program starts running
int main() {
    PromptManager manager;
    
    // Automatically load old data when the program starts
    manager.loadFromFile();
    int option = -1;
    
    // Use a loop to keep showing the menu until the user wants to exit
    while (option != 0) {
        cout << "\n===== AI Prompt Engineering Studio =====" << endl;
        cout << "1. Create New Prompt" << endl;
        cout << "2. View All Prompts" << endl;
        cout << "3. Rate a Prompt" << endl;
        cout << "4. Search Prompts" << endl;
        cout << "5. Mark / Unmark Favorite" << endl;
        cout << "6. View Favorites" << endl;
        cout << "7. Edit a Prompt (saves old version to history)" << endl;
        cout << "8. View Prompt History" << endl;
        cout << "9. Compare Two Prompts" << endl;
        cout << "10. View Statistics Dashboard" << endl;
        cout << "11. Effectiveness Analysis" << endl;
        cout << "12. Delete a Prompt" << endl;
        cout << "0. Exit" << endl;
        cout << "=========================================" << endl;
        cout << "Enter your choice: ";
        
        // This makes sure the program doesn't crash if someone types a letter instead of a number
        if (!(cin >> option)) {
            cin.clear();
            cin.ignore(10000, '\n');
            cout << "Invalid input. Please enter a number." << endl;
            continue;
        }
        // Call the correct function depending on what the user typed
        switch (option) {
            case 1: manager.createNewPrompt(); break;
            case 2: manager.viewAllPrompts(); break;
            case 3: manager.ratePrompt(); break;
            case 4: manager.searchPrompts(); break;
            case 5: manager.toggleFavorite(); break;
            case 6: manager.viewFavorites(); break;
            case 7: manager.editPrompt(); break;
            case 8: manager.viewHistory(); break;
            case 9: manager.comparePrompts(); break;
            case 10: manager.displayStatistics(); break;
            case 11: manager.effectivenessAnalysis(); break;
            case 12: manager.deletePrompt(); break;
            case 0: cout << "Exiting program. Saving prompts..." << endl; break;
            default: cout << "Invalid choice. Please try again." << endl;
        }
        
        // Save automatically after each action so no data is ever lost
        if (option != 0) {
            manager.saveToFile();
        }
    }
    // One final save just in case
    manager.saveToFile();
    return 0;
}
