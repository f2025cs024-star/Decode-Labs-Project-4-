#include<iostream>
using namespace std;
class livingbeing{
    protected:
    string name;
    int age;
    public:
    void introduce(){
        cout<<"Hello, my name is "<<name<<" and I am "<<age<<" years old."<<endl;
    };
};
class person: virtual public livingbeing{
    protected:
    long long int CNIC;
    string cityname;
    public:

};
class doctor: virtual public person{
    protected:
    string specialization;
    int years_of_experience;
    public:

};
class Researcher:virtual public person{
    protected:
    string field_of_research;
    int number_of_publications;
    public:

};
class senior_MO: public doctor,  public Researcher{
    protected:
    string hospital_name;
    int monthly_salary;
    int yearly_salary;
    float bonus=0.0;
    public:
    void perfomsurgeries(){
        cout<<"i can perform surgeries."<<endl;
    };
    void publish(){
        cout<<"i can publish medical papers."<<endl;
    };
    void calculate_bonus(){
          if(years_of_experience>10){
            bonus=yearly_salary*0.15;
          }
          else{
            bonus=yearly_salary*0.08;
          }
    };
    senior_MO(string name,int age, long long int CNIC, string cityname, string specialization, int years_of_experience, string field_of_research, int number_of_publications, string hospital_name, int monthly_salary){
        this->name=name;
        this->age=age;
        this->CNIC=CNIC;
        this->cityname=cityname;
        this->specialization=specialization;
        this->years_of_experience=years_of_experience;
        this->field_of_research=field_of_research;
        this->number_of_publications=number_of_publications;
        this->hospital_name=hospital_name;
        this->monthly_salary=monthly_salary;
        yearly_salary=monthly_salary*12;
        calculate_bonus();
    };
    void display(){
        introduce();
        cout<<"CNIC: "<<CNIC<<endl;
        cout<<"City: "<<cityname<<endl;
        cout<<"Specialization: "<<specialization<<endl;
        cout<<"Years of Experience: "<<years_of_experience<<endl;
        cout<<"Field of Research: "<<field_of_research<<endl;
        cout<<"Number of Publications: "<<number_of_publications<<endl;
        cout<<"Hospital Name: "<<hospital_name<<endl;
        cout<<"Monthly Salary: "<<monthly_salary<<endl;
        cout<<"Bonus: "<<bonus<<endl;
        publish();
        perfomsurgeries();
    };
};
int main(){
    senior_MO doctor1("Dr. Smith", 45, 1234567890123, "New York", "Cardiology", 15, "Heart Diseases", 50, "City Hospital", 10000);
    doctor1.display();
    return 0;
};



