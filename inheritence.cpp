#include<iostream>
using namespace std;

class person {
public:
    string name;

    void setname(string n) {
        name = n;
    }

    void showname() {
        cout << "name=" << name << endl;
    }
};

class student : public person {
public:
    int rollnumber;

    void setrollnum(int roll) {
        rollnumber = roll;
    }

    void showdetail() {
        cout << "ROLL NUMBER=" << rollnumber << endl;
    }
};

int main() {
    student s1;

    s1.setname("Talha");
    s1.setrollnum(101);

    s1.showname();
    s1.showdetail();

    return 0;
}
