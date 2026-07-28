#include<iostream>
#include<string>
using namespace std;

class Computer {
private:
    int computerID;
    string userID;

public:
    Computer(int cid, string uid) {
        computerID = cid;
        userID = uid;
    }

    friend class Lab;
};

class Lab {
public:
    void showDetails(Computer c) {
        cout << "Computer ID: " << c.computerID << endl;
        cout << "User ID: " << c.userID << endl;
    }
};

int main() {
    Computer c1(101, "Ali123");
    Lab lab;
    lab.showDetails(c1);
    return 0;
}