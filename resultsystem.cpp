#include<iostream>
using namespace std;
class result{
    int marks;
    public:
    void setmarks(int marks){
        this->marks=marks;
    };
    void getmarks(){
        cout<<"marks: "<<marks<<endl;

    };
    void calcgrade(){
        if(marks>=90){
            cout<<"grade: A"<<endl;
        }else if(marks>=80){
            cout<<"grade: B"<<endl;
        }else if(marks>=70){
            cout<<"grade: C"<<endl;
        }else if(marks>=60){
            cout<<"grade: D"<<endl;
        }else{
            cout<<"grade: F"<<endl;
        }
    };
};
int main(){
    result r1;
    r1.setmarks(85);
    r1.getmarks();
    r1.calcgrade();
    return 0;
};